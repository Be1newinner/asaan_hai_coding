from app.db.base import BaseModel
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, Text, ForeignKey, TIMESTAMP, Boolean

from datetime import datetime, timezone

from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if TYPE_CHECKING:
    from app.models.section import Section
    from app.models.user import User
    from app.models.media import Media, CourseMedias


class Course(BaseModel):
    __tablename__ = "courses"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    instructor_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    difficulty_level: Mapped[str | None] = mapped_column(String(20))
    image_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("media.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,  # this is one to one to courses
    )

    # relations
    sections: Mapped[list["Section"]] = relationship(
        back_populates="course",
        cascade="all, delete-orphan",
        lazy="select",
    )
    instructor: Mapped["User | None"] = relationship(
        back_populates="courses", lazy="selectin"
    )
    image: Mapped["Media | None"] = relationship(
        back_populates="course",
        uselist=False,
        single_parent=True,
        cascade="all, delete-orphan",
        lazy="joined",
    )
    medias: Mapped[list["CourseMedias"]] = relationship(
        "CourseMedias",
        back_populates="course",
        cascade="all, delete-orphan",
        single_parent=True,
        lazy="selectin",
    )

    gallery: Mapped[list["Media"]] = relationship(
        "Media",
        secondary="course_medias",
        primaryjoin="Course.id == foreign(CourseMedias.course_id)",
        secondaryjoin="Media.id == foreign(CourseMedias.image_id)",
        viewonly=True,
        lazy="selectin",
    )
