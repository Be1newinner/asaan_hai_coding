from __future__ import annotations
from datetime import date, datetime
from typing import Optional, List
from uuid import UUID
from app.schemas.media import MediaWithUrl

from pydantic import BaseModel, Field


# ---------- Skill ----------
class SkillCreate(BaseModel):
    title: str = Field(min_length=1)
    category: Optional[str] = None


class SkillUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None


class SkillOut(BaseModel):
    id: int
    title: str
    category: Optional[str] = None


# ---------- SupportLink ----------
class SupportLinkCreate(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None


class SupportLinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None


class SupportLinkOut(BaseModel):
    id: int
    title: str
    url: str
    icon: Optional[str] = None


# ---------- Achievement ----------
class AchievementCreate(BaseModel):
    title: str


class AchievementUpdate(BaseModel):
    title: Optional[str] = None


class AchievementOut(BaseModel):
    id: int
    title: str


# ---------- Experience ----------
class ExperienceCreate(BaseModel):
    title: str
    company: str
    description: Optional[str] = None
    from_date: date
    to_date: Optional[date] = None
    responsibilities: Optional[List[str]] = None


class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    responsibilities: Optional[List[str]] = None


class ExperienceOut(BaseModel):
    id: int
    title: str
    company: str
    description: Optional[str] = None
    from_date: date
    to_date: Optional[date] = None
    responsibilities: Optional[List[str]] = None


# ---------- Profile ----------
class ProfileCreate(BaseModel):
    full_name: str
    role: Optional[str] = None
    about_me: Optional[str] = None
    description: Optional[str] = None
    availability: Optional[str] = None

    # Nested one-to-many children
    support_links: Optional[List[SupportLinkCreate]] = None
    achievements: Optional[List[AchievementCreate]] = None
    experiences: Optional[List[ExperienceCreate]] = None
    skill_ids: Optional[List[int]] = None

    profile_image_id: Optional[UUID] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    about_me: Optional[str] = None
    description: Optional[str] = None
    availability: Optional[str] = None

    support_links: Optional[List[SupportLinkCreate]] = None
    achievements: Optional[List[AchievementCreate]] = None
    experiences: Optional[List[ExperienceUpdate]] = None

    skill_ids: Optional[List[int]] = None

    profile_image_id: Optional[UUID] = None


class ProfileRead(BaseModel):
    full_name: str
    role: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    id: int
    about_me: Optional[str] = None
    availability: Optional[str] = None
    updated_at: datetime

    profile_image: Optional[MediaWithUrl] = None
    support_links: List[SupportLinkOut] | None = []
    achievements: List[AchievementOut] = []
    experiences: List[ExperienceOut] = []
    technical_skills: List[SkillOut] = []
