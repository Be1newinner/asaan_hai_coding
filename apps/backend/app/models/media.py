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
        TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Ownership FKs (one-to-one per parent)
    project_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=True,
        unique=True,  # 1–1: at most one Media owned by a given Project as its thumbnail
        index=True,
    )
    course_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=True,
        unique=True,  # 1–1: at most one Media owned by a given Course as its thumbnail
        index=True,
    )

    __table_args__ = (
        # Constraints
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

    # Relationships
    # One-to-one backrefs (owned)
    project_thumbnail_of: Mapped[Optional["Project"]] = relationship(
        "Project",
        back_populates="thumbnail_image",
        uselist=False,
        lazy="selectin",
        primaryjoin="Project.id == foreign(Media.project_id)",
        foreign_keys="[Media.project_id]",
    )
    course_thumbnail_of: Mapped[Optional["Course"]] = relationship(
        "Course",
        back_populates="image",
        uselist=False,
        lazy="selectin",
        primaryjoin="Course.id == foreign(Media.course_id)",
        foreign_keys="[Media.course_id]",
    )

    # Association-object links for galleries (unchanged)
    project_media_link: Mapped[Optional["ProjectMedias"]] = relationship(
        "ProjectMedias", back_populates="media", uselist=False, lazy="selectin"
    )
    course_media_link: Mapped[Optional["CourseMedias"]] = relationship(
        "CourseMedias", back_populates="media", uselist=False, lazy="selectin"
    )


class ProjectMedias(BaseModel):
    __tablename__ = "project_medias"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    image_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("media.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    project: Mapped["Project"] = relationship(
        "Project",
        back_populates="medias",
        lazy="joined",
    )
    media: Mapped["Media"] = relationship(
        "Media",
        back_populates="project_media_link",
        lazy="joined",
    )


class CourseMedias(BaseModel):
    __tablename__ = "course_medias"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    image_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("media.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    course_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    course: Mapped["Course"] = relationship(
        "Course",
        back_populates="medias",
        lazy="joined",
    )
    media: Mapped["Media"] = relationship(
        "Media",
        back_populates="course_media_link",
        lazy="joined",
    )
