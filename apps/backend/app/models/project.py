from app.db.base import BaseModel
from sqlalchemy import String, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from app.models.project_detail import ProjectDetail
from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.media import Media, ProjectMedias


class Project(BaseModel):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    client_name: Mapped[str | None] = mapped_column(String(100))
    project_type: Mapped[str | None] = mapped_column(String(50))
    image_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("media.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,  # this is one to one
    )
    live_demo_url: Mapped[str | None] = mapped_column(String(255))
    github_url: Mapped[str | None] = mapped_column(String(255))
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    gallery: Mapped[list["Media"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        uselist=False,
        single_parent=True,
        lazy="joined",
    )

    detail: Mapped["ProjectDetail"] = relationship(
        back_populates="project", uselist=False, cascade="all, delete-orphan"
    )
    thumbnail_image: Mapped["Media | None"] = relationship(
        back_populates="project",
        uselist=False,
        single_parent=True,
        cascade="all, delete-orphan",
        lazy="joined",
    )
    medias: Mapped[list["ProjectMedias"]] = relationship(
        "ProjectMedias",
        back_populates="project",
        cascade="all, delete-orphan",
        single_parent=True,
        lazy="selectin",
    )

    gallery: Mapped[list["Media"]] = relationship(
        "Media",
        secondary="project_medias",
        primaryjoin="Project.id == foreign(ProjectMedias.project_id)",
        secondaryjoin="Media.id == foreign(ProjectMedias.image_id)",
        viewonly=True,
        lazy="selectin",
    )
