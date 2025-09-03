from app.db.base import BaseModel
from sqlalchemy import (
    String,
    Text,
    Boolean,
    TIMESTAMP,
    ForeignKey,
    Table,
    Column,
    Integer,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func

from typing import TYPE_CHECKING, Optional

from app.models.Junctions import project_tag_relations


if TYPE_CHECKING:
    from app.models.media import Media


project_technology_relations = Table(
    "project_technology_relations",
    BaseModel.metadata,
    Column("project_id", Integer, ForeignKey("projects.id"), primary_key=True),
    Column(
        "technology_id",
        Integer,
        ForeignKey("project_technologies.id"),
        primary_key=True,
    ),
)
project_feature_relations = Table(
    "project_feature_relations",
    BaseModel.metadata,
    Column("project_id", Integer, ForeignKey("projects.id"), primary_key=True),
    Column("feature_id", Integer, ForeignKey("project_features.id"), primary_key=True),
)


class Project(BaseModel):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    client_name: Mapped[Optional[str]] = mapped_column(String(100))
    project_type: Mapped[Optional[str]] = mapped_column(String(50))

    # Thumbnail (1–1 to Media.id)
    image_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("media.id", ondelete="SET NULL"),
        unique=True,
        nullable=True,
    )

    live_demo_url: Mapped[Optional[str]] = mapped_column(String(255))
    github_url: Mapped[Optional[str]] = mapped_column(String(255))
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Gallery one-to-many
    gallery_medias: Mapped[list["Media"]] = relationship(
        "Media",
        back_populates="project_owner",
        primaryjoin="Project.id == foreign(Media.project_owner_id)",
        foreign_keys="[Media.project_owner_id]",
        lazy="selectin",
        passive_deletes=True,  # rely on DB ondelete
    )

    # Thumbnail reverse
    thumbnail_image: Mapped[Optional["Media"]] = relationship(
        "Media",
        primaryjoin="Project.image_id == foreign(Media.id)",
        back_populates="project_thumbnail_of",
        uselist=False,
        lazy="selectin",
        foreign_keys="[Project.image_id]",
    )


class ProjectTechnologies(BaseModel):
    __tablename__ = "project_technologies"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    projects: Mapped[list["Project"]] = relationship(
        "Projects",
        secondary=project_technology_relations,
        back_populates="technologies",
    )


class ProjectFeatures(BaseModel):
    __tablename__ = "project_features"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    features: Mapped[list["Project"]] = relationship(
        "Projects",
        secondary=project_technology_relations,
        back_populates="technologies",
    )


class Tag(BaseModel):
    __tablename__ = "tags"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    projects: Mapped[list["Project"]] = relationship(
        "Project",
        secondary=project_tag_relations,
        back_populates="tags",
        lazy="selectin",
    )
