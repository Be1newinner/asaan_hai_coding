from __future__ import annotations
from datetime import datetime, date
from typing import Optional
from uuid import UUID

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Date,
    Table,
    TIMESTAMP,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PG_UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base import BaseModel
from app.models.media import Media

profile_skill_association = Table(
    "profile_skill_association",
    BaseModel.metadata,
    Column("profile_id", Integer, ForeignKey("profiles.id"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id"), primary_key=True),
    Column("confidence", String(10), nullable=True),
)


class Skill(BaseModel):
    """
    Represents a single, reusable technical skill.
    e.g., A single "JavaScript" entry can be linked to many profiles.
    """

    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    category: Mapped[Optional[str]] = mapped_column(String, index=True)

    profiles = relationship(
        "Profile",
        secondary=profile_skill_association,
        back_populates="technical_skills",
    )


class Profile(BaseModel):
    """
    The main profile model containing all your personal and professional details.
    This acts as the central hub connecting to all other related information.
    """

    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    role: Mapped[Optional[str]] = mapped_column(String)
    about_me: Mapped[Optional[str]] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    availability: Mapped[Optional[str]] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # --- Relationships ---

    profile_image_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("media.id"), unique=True, nullable=True
    )
    profile_image: Mapped[Optional["Media"]] = relationship(
        "Media",
        back_populates="profile_thumbnail_of",
        primaryjoin="Profile.profile_image_id == foreign(Media.id)",
        foreign_keys="[Profile.profile_image_id]",
        uselist=False,
        lazy="selectin",
        cascade="all",
        single_parent=True,
        overlaps="thumbnail_image,project_thumbnail_of,profile_thumbnail_of,image",
    )
    support_links = relationship(
        "SupportLink", back_populates="profile", cascade="all", lazy="selectin"
    )
    achievements = relationship(
        "Achievement", back_populates="profile", cascade="all", lazy="selectin"
    )
    experiences = relationship(
        "Experience", back_populates="profile", cascade="all", lazy="selectin"
    )

    technical_skills = relationship(
        "Skill",
        secondary=profile_skill_association,
        back_populates="profiles",
        lazy="selectin",
    )


class SupportLink(BaseModel):
    """
    Stores support links like GitHub, LinkedIn, personal website, etc.
    This has a many-to-one relationship with Profile.
    """

    __tablename__ = "support_links"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    icon: Mapped[Optional[str]] = mapped_column(String)

    profile_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"), nullable=False)
    profile = relationship("Profile", back_populates="support_links")


class Achievement(BaseModel):
    """
    Stores individual achievements.
    This has a many-to-one relationship with Profile.
    """

    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)

    profile_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"), nullable=False)
    profile = relationship("Profile", back_populates="achievements")


class Experience(BaseModel):
    """
    Stores work experience details.
    This has a many-to-one relationship with Profile.
    """

    __tablename__ = "experiences"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    company: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    from_date: Mapped[date] = mapped_column(Date, nullable=False)
    to_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    responsibilities: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String))

    profile_id: Mapped[int] = mapped_column(ForeignKey("profiles.id"), nullable=False)
    profile = relationship("Profile", back_populates="experiences")
