from __future__ import annotations
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, TYPE_CHECKING
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey

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
from sqlalchemy.sql import func

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

    public_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    resource_type: Mapped[MediaType] = mapped_column(
        SAEnum(MediaType, name="media_type_enum"), nullable=False
    )
    format: Mapped[Optional[str]] = mapped_column(String(32))
    version: Mapped[Optional[int]] = mapped_column(Integer)

    secure_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    url: Mapped[Optional[str]] = mapped_column(String(1024))

    content_type: Mapped[Optional[str]] = mapped_column(String(100))
    bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    width: Mapped[Optional[int]] = mapped_column(Integer)
    height: Mapped[Optional[int]] = mapped_column(Integer)
    duration_ms: Mapped[Optional[int]] = mapped_column(Integer)

    folder: Mapped[Optional[str]] = mapped_column(String(255))
    original_filename: Mapped[Optional[str]] = mapped_column(String(255))

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
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Foreign Keys
    project_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=True,
        unique=True,
        index=True,
    )
    course_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=True,
        unique=True,
        index=True,
    )

    project_owner_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    course_owner_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    # Constraints
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
        CheckConstraint(
            "NOT (project_owner_id IS NOT NULL AND course_owner_id IS NOT NULL)",
            name="media_at_most_one_owner",
        ),
    )

    # Relationships 1: 1:1 for thumbnail
    course_thumbnail_of: Mapped[Optional["Course"]] = relationship(
        "Course",
        back_populates="image",
        uselist=False,
        lazy="selectin",
        primaryjoin="Course.id == foreign(Media.course_id)",
        foreign_keys="[Media.course_id]",
    )

    # Relationships 2 :
    project_thumbnail_of: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="thumbnail_image",
        uselist=False,
        lazy="selectin",
        primaryjoin="foreign(Media.id) == Project.image_id",
        foreign_keys="[Media.id]",
    )

    # Relationships 3 :  for gallery ownership (1–N)
    project_owner: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="gallery_medias",
        lazy="selectin",
        foreign_keys="[Media.project_owner_id]",
        primaryjoin="Project.id == foreign(Media.project_owner_id)",
    )
    # Relationships 4 :
    course_owner: Mapped[Optional["Course"]] = relationship(
        "Course",
        back_populates="gallery_medias",
        lazy="selectin",
        foreign_keys="[Media.course_owner_id]",
        primaryjoin="Course.id == foreign(Media.course_owner_id)",
    )
