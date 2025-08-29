from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional, Sequence
from typing import BinaryIO, Optional, Tuple, Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status

from app.models.media import Media, MediaType as ModelMediaType
from app.schemas.media import MediaCreate, MediaUpdate, MediaType as SchemaMediaType
from app.services.base import CRUDBase
from sqlalchemy.exc import IntegrityError

from cloudinary.uploader import upload, upload_large, destroy


class MediaService(CRUDBase[Media, MediaCreate, MediaUpdate]):
    def __init__(self) -> None:
        super().__init__(Media)

    async def list_filtered(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 50,
        resource_type: Optional[SchemaMediaType] = None,
        is_published: Optional[bool] = None,
        is_deleted: Optional[bool] = False,
        search: Optional[str] = None,
    ) -> tuple[Sequence[Media], int]:
        base = select(Media)
        if resource_type is not None:
            base = base.where(Media.resource_type == resource_type)
        if is_published is not None:
            base = base.where(Media.is_published == is_published)
        if is_deleted is not None:
            base = base.where(Media.is_deleted == is_deleted)
        if search:
            ilike = f"%{search}%"
            base = base.where(
                (Media.title.ilike(ilike))
                | (Media.alt_text.ilike(ilike))
                | (Media.original_filename.ilike(ilike))
            )

        # total count, drop ordering if any for speed
        count_stmt = select(func.count()).select_from(base.order_by(None).subquery())
        total = int((await db.execute(count_stmt)).scalar_one())

        # pagination
        page_stmt = base.offset(skip).limit(limit)
        result = await db.execute(page_stmt)
        items = result.scalars().all()
        return items, total

    async def get_by_public_id(self, db: AsyncSession, public_id: str) -> Media | None:
        """Gets a media by its public_id."""
        statement = select(self.model).where(self.model.public_id == public_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    async def get_media_count(self, db: AsyncSession) -> int:
        """Gets the total number of media files."""
        statement = select(func.count()).select_from(self.model)
        result = await db.execute(statement)
        return result.scalar_one()

    async def create_with_rules(self, db: AsyncSession, obj_in: MediaCreate) -> Media:
        if obj_in.resource_type == SchemaMediaType.image and obj_in.duration_ms is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Images cannot have duration_ms.",
            )
        try:
            return await self.create(db, obj_in)
        except IntegrityError:
            # unique public_id collision
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="public_id must be unique.",
            )

    async def update_with_rules(
        self, db: AsyncSession, obj_id: UUID, obj_in: MediaUpdate
    ) -> Media:
        db_obj = await self.get(db, obj_id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Media not found")

        patch = obj_in.model_dump(exclude_unset=True)

        new_resource_type = patch.get("resource_type", db_obj.resource_type)
        new_duration = patch.get("duration_ms", db_obj.duration_ms)
        if new_resource_type == SchemaMediaType.image and new_duration is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Images cannot have duration_ms.",
            )

        return await self.update(db, db_obj, obj_in)

    async def update_public_id(
        self, db: AsyncSession, media_id: UUID, new_public_id: str
    ) -> Media:
        """Updates the public_id of a media file."""
        db_obj = await self.get(db, media_id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Media not found")

        # Check if the new public_id already exists
        existing_media = await self.get_by_public_id(db, new_public_id)
        if existing_media:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="public_id must be unique.",
            )

        db_obj.public_id = new_public_id
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def soft_delete(
        self, db: AsyncSession, obj_id: UUID, *, deleted_by: Optional[UUID]
    ) -> Media:
        db_obj = await self.get(db, obj_id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Media not found")
        db_obj.is_deleted = True
        db_obj.deleted_at = datetime.now(timezone.utc)
        db_obj.deleted_by = deleted_by
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def restore(self, db: AsyncSession, obj_id: UUID) -> Media:
        db_obj = await self.get(db, obj_id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Media not found")
        db_obj.is_deleted = False
        db_obj.deleted_at = None
        db_obj.deleted_by = None
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete_from_cloudinary(self, public_id: str, resource_type: ModelMediaType):
        """Deletes a file from Cloudinary."""
        cld_resource_type = "video" if resource_type == ModelMediaType.video else "image"
        try:
            destroy(public_id, resource_type=cld_resource_type)
            return {"message": "Media deleted successfully from Cloudinary."}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to delete media from Cloudinary: {e}",
            )

    async def delete_media_from_cloudinary_and_db(
        self, db: AsyncSession, media_id: UUID
    ):
        db_obj = await self.get(db, media_id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Media not found")

        await self.delete_from_cloudinary(db_obj.public_id, db_obj.resource_type)

        # Delete from database
        await self.delete(db, media_id)
        return {"message": "Media deleted successfully from Cloudinary and database."}


MAX_DIRECT_VIDEO = 100 * 1024 * 1024


def _select_uploader(resource_type: SchemaMediaType, size_bytes: int):
    if resource_type == SchemaMediaType.video and size_bytes > MAX_DIRECT_VIDEO:
        return upload_large, {"chunk_size": 20 * 1024 * 1024}
    return upload, {}


def upload_to_cloudinary(
    file_stream: BinaryIO,
    *,
    filename: str,
    resource_type: SchemaMediaType,
    folder: Optional[str] = None,
    public_id: Optional[str] = None,
    overwrite: bool = False,
    context: Optional[dict] = None,
    size_bytes: int,
) -> dict[str, Any] | None:
    options = {
        "resource_type": "video" if resource_type == SchemaMediaType.video else "image",
        "folder": folder,
        "public_id": public_id,
        "overwrite": overwrite,
        "context": context,
        "use_filename": True if public_id is None else False,
        "unique_filename": True if public_id is None else False,
    }
    options = {k: v for k, v in options.items() if v is not None}

    uploader, extra = _select_uploader(resource_type, size_bytes)
    try:
        return uploader(file_stream, **options, **extra)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Cloudinary upload failed: {e}",
        )


media_service = MediaService()
