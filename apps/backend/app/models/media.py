from __future__ import annotations
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4


from sqlalchemy import (
    String,
    Text,
    TIMESTAMP,
    Boolean,
    Integer,
    CheckConstraint,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import Enum as SAEnum

from app.db.base import BaseModel

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.media import Media
    from app.models.project import Project


class MediaType(str, Enum):
    image = "image"
    video = "video"


class Media(BaseModel):
    __tablename__ = "media"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Cloudinary core identifiers
    public_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    resource_type: Mapped[MediaType] = mapped_column(
        SAEnum(MediaType, name="media_type_enum"), nullable=False
    )
    format: Mapped[Optional[str]] = mapped_column(String(32))
    version: Mapped[Optional[int]] = mapped_column(Integer)

    # Delivery URLs
    secure_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    url: Mapped[Optional[str]] = mapped_column(String(1024))

    # MIME and size
    content_type: Mapped[Optional[str]] = mapped_column(String(100))
    bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    width: Mapped[Optional[int]] = mapped_column(Integer)
    height: Mapped[Optional[int]] = mapped_column(Integer)
    duration_ms: Mapped[Optional[int]] = mapped_column(Integer)

    # Organization / naming
    folder: Mapped[Optional[str]] = mapped_column(String(255))
    original_filename: Mapped[Optional[str]] = mapped_column(String(255))

    # Presentation / lifecycle
    title: Mapped[Optional[str]] = mapped_column(String(255))
    alt_text: Mapped[Optional[str]] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)

    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True
    )
    deleted_by: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True), nullable=True, index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        UniqueConstraint("public_id", name="uq_media_public_id"),
        CheckConstraint("bytes >= 0", name="bytes_non_negative"),
        CheckConstraint(
            "(width IS NULL OR width > 0) AND (height IS NULL OR height > 0)",
            name="dims_positive",
        ),
        CheckConstraint(
            "(resource_type = 'image' AND duration_ms IS NULL) OR resource_type = 'video'",
            name="image_no_duration",
        ),
    )

    course: Mapped["Course | None"] = relationship(
        back_populates="image",
        uselist=False,
        lazy="select",
    )
    project: Mapped["Project | None"] = relationship(
        back_populates="thumbnail_image",
        uselist=False,
        lazy="select",
    )
