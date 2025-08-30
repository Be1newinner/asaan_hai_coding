from uuid import UUID
from typing import List
from pydantic import BaseModel, Field
from app.schemas.base import ORMBase, TimestampMixin
from app.schemas.section import SectionRead
from app.schemas.media import MediaWithUrl


# ─── WRITE ──────────────────────────────────────────
class CourseCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: str | None = None
    instructor_id: UUID | None = None
    difficulty_level: str | None = Field(None, max_length=20)
    is_published: bool = False
    image_id: UUID | None


class CourseUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    description: str | None = None
    instructor_id: UUID | None = None
    difficulty_level: str | None = Field(None, max_length=20)
    is_published: bool | None = None
    image_id: UUID | None


class InstructorRead(BaseModel):
    full_name: str
    email: str
    id: UUID


# ─── READ (nested) ─────────────────────────────────
class CourseReadBase(ORMBase, TimestampMixin):
    id: UUID
    title: str
    description: str | None
    difficulty_level: str | None
    is_published: bool
    instructor: InstructorRead
    image: MediaWithUrl | None


class CourseRead(CourseReadBase):
    sections: List[SectionRead] = []
