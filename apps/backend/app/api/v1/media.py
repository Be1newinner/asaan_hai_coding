from __future__ import annotations
from typing import Optional, Sequence, cast
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
    status,
    HTTPException,
    File,
    UploadFile,
    Form,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.schemas.media import (
    MediaCreate,
    MediaUpdate,
    MediaRead,
    MediaReadList,
    MediaType,
)
from app.services.media import media_service, upload_to_cloudinary
from app.api.deps import get_current_admin


router = APIRouter(prefix="/media", tags=["Media"])

ACCEPTED_IMAGE_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ACCEPTED_VIDEO_MIME = {"video/mp4", "video/webm", "video/quicktime"}


@router.get(
    "/",
    response_model=MediaReadList,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_admin)],
    summary="List media with filters",
)
async def list_media(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    resource_type: Optional[MediaType] = Query(None),
    is_published: Optional[bool] = Query(None),
    is_deleted: Optional[bool] = Query(False),
    search: Optional[str] = Query(None, max_length=255),
    db: AsyncSession = Depends(get_async_session),
):
    items, total = await media_service.list_filtered(
        db,
        skip=skip,
        limit=limit,
        resource_type=resource_type,
        is_published=is_published,
        is_deleted=is_deleted,
        search=search,
    )
    return MediaReadList(items=cast(Sequence[MediaRead], items), total=total)


@router.get(
    "/{media_id}",
    response_model=MediaRead,
    status_code=status.HTTP_200_OK,
    summary="Get a media by ID",
    responses={404: {"description": "Media not found"}},
)
async def get_media(media_id: UUID, db: AsyncSession = Depends(get_async_session)):
    obj = await media_service.get(db, media_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Media not found")
    return obj


@router.post(
    "/",
    response_model=MediaRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin)],
    summary="Upload media to Cloudinary and create media record",
)
async def create_media(
    file: UploadFile = File(..., description="Image or video file"),
    resource_type: MediaType = Form(..., description="image | video"),
    folder: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    alt_text: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    is_published: bool = Form(False),
    db: AsyncSession = Depends(get_async_session),
):
    if resource_type == MediaType.image and (
        file.content_type not in ACCEPTED_IMAGE_MIME
    ):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image content-type: {file.content_type}",
        )
    if resource_type == MediaType.video and (
        file.content_type not in ACCEPTED_VIDEO_MIME
    ):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported video content-type: {file.content_type}",
        )

    await file.seek(0)
    try:
        file.file.seek(0, 2)
        size_bytes = file.file.tell()
        file.file.seek(0)
    except Exception:
        content = await file.read()
        size_bytes = len(content)
        from io import BytesIO

        file_stream = BytesIO(content)
    else:
        file_stream = file.file

    context = {}
    if title:
        context["caption"] = title
    if alt_text:
        context["alt"] = alt_text

    if file.filename is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing from the uploaded file.",
        )

    cld_resp = upload_to_cloudinary(
        file_stream,
        filename=file.filename,
        resource_type=resource_type,
        folder=folder,
        context=context or None,
        size_bytes=size_bytes,
    )

    if cld_resp is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Media upload failed unexpectedly.",
        )

    payload = MediaCreate(
        public_id=cld_resp["public_id"],
        resource_type=resource_type,
        format=cld_resp.get("format"),
        version=cld_resp.get("version"),
        secure_url=cld_resp["secure_url"],
        url=cld_resp.get("url"),
        content_type=file.content_type,
        bytes=cld_resp.get("bytes", size_bytes),
        width=cld_resp.get("width"),
        height=cld_resp.get("height"),
        duration_ms=(
            int(cld_resp["duration"] * 1000)
            if ("duration" in cld_resp and resource_type == MediaType.video)
            else None
        ),
        folder=folder,
        original_filename=cld_resp.get("original_filename") or file.filename,
        title=title,
        alt_text=alt_text,
        description=description,
        is_published=is_published,
        is_deleted=False,
    )

    obj = await media_service.create_with_rules(db, payload)
    return obj


@router.patch(
    "/{media_id}",
    response_model=MediaRead,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_admin)],
    summary="Update media",
)
async def update_media(
    media_id: UUID, payload: MediaUpdate, db: AsyncSession = Depends(get_async_session)
):
    return await media_service.update_with_rules(db, media_id, payload)


@router.delete(
    "/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin)],
    summary="Hard delete media",
    responses={204: {"description": "Deleted"}, 404: {"description": "Not found"}},
)
async def hard_delete_media(
    media_id: UUID, db: AsyncSession = Depends(get_async_session)
):
    await media_service.delete_media_from_cloudinary_and_db(db, media_id)
    return


@router.post(
    "/{media_id}/soft-delete",
    response_model=MediaRead,
    dependencies=[Depends(get_current_admin)],
    summary="Soft delete media",
)
async def soft_delete_media(
    media_id: UUID,
    deleted_by: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_async_session),
):
    return await media_service.soft_delete(db, media_id, deleted_by=deleted_by)


@router.post(
    "/{media_id}/restore",
    response_model=MediaRead,
    dependencies=[Depends(get_current_admin)],
    summary="Restore soft-deleted media",
)
async def restore_media(media_id: UUID, db: AsyncSession = Depends(get_async_session)):
    return await media_service.restore(db, media_id)


@router.delete(
    "/{media_id}/delete-permanent",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_admin)],
    summary="Permanently delete media from Cloudinary and database",
    responses={
        200: {"description": "Media deleted successfully"},
        404: {"description": "Media not found"},
        502: {"description": "Failed to delete media from Cloudinary"},
    },
)
async def delete_media_permanent(
    media_id: UUID, db: AsyncSession = Depends(get_async_session)
):
    return await media_service.delete_media_from_cloudinary_and_db(db, media_id)
