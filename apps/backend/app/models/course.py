from app.db.base import BaseModel
from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, Text, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.sql import func

from datetime import datetime, timezone

from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if TYPE_CHECKING:
    from app.models.section import Section
    from app.models.user import User
    from app.models.media import Media


class Course(BaseModel):
    __tablename__ = "courses"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    difficulty_level: Mapped[Optional[str]] = mapped_column(String(20))

    # Foreign Keys
    instructor_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    image_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("media.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
    )

    # Relations 1: 1:N for gallery images/videos
    gallery_medias: Mapped[list["Media"]] = relationship(
        "Media",
        back_populates="course_owner",
        primaryjoin="Course.id == foreign(Media.course_owner_id)",
        foreign_keys="[Media.course_owner_id]",
        lazy="selectin",
        passive_deletes=True,
    )

    # Relations 2: 1:1 for Thumbnail image
    image: Mapped[Optional["Media"]] = relationship(
        "Media",
        back_populates="course_thumbnail_of",
        primaryjoin="Course.id == foreign(Media.course_id)",
        foreign_keys="[Media.course_id]",
        cascade="all, delete-orphan",
        single_parent=True,
        uselist=False,
        lazy="selectin",
    )
