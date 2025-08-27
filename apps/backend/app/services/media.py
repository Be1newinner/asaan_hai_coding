from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional, Sequence
from typing import BinaryIO, Optional, Tuple, Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status

from app.models.media import Media
from app.schemas.media import MediaCreate, MediaUpdate, MediaType
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
        resource_type: Optional[MediaType] = None,
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

    async def create_with_rules(self, db: AsyncSession, obj_in: MediaCreate) -> Media:
        if obj_in.resource_type == MediaType.image and obj_in.duration_ms is not None:
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
        if new_resource_type == MediaType.image and new_duration is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Images cannot have duration_ms.",
            )

        return await self.update(db, db_obj, obj_in)

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

    async def delete_media_from_cloudinary_and_db(
        self, db: AsyncSession, media_id: UUID
    ):
        db_obj = await self.get(db, media_id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Media not found")

        # Determine Cloudinary resource type
        cld_resource_type = (
            "video" if db_obj.resource_type == MediaType.video else "image"
        )

        try:
            # Delete from Cloudinary
            destroy(db_obj.public_id, resource_type=cld_resource_type)
        except Exception as e:
            # Log the error and raise an HTTPException
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to delete media from Cloudinary: {e}",
            )

        # Delete from database
        await self.delete(db, media_id)
        return {"message": "Media deleted successfully from Cloudinary and database."}


MAX_DIRECT_VIDEO = 100 * 1024 * 1024


def _select_uploader(resource_type: MediaType, size_bytes: int):
    if resource_type == MediaType.video and size_bytes > MAX_DIRECT_VIDEO:
        return upload_large, {"chunk_size": 20 * 1024 * 1024}
    return upload, {}


def upload_to_cloudinary(
    file_stream: BinaryIO,
    *,
    filename: str,
    resource_type: MediaType,
    folder: Optional[str] = None,
    public_id: Optional[str] = None,
    overwrite: bool = False,
    context: Optional[dict] = None,
    size_bytes: int,
) -> dict[str, Any] | None:
    options = {
        "resource_type": "video" if resource_type == MediaType.video else "image",
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
