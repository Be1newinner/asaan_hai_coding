from typing import List
from pydantic import BaseModel, Field
from app.schemas.base import ORMBase
from app.schemas.lesson import LessonRead
from uuid import UUID


# ─── WRITE ──────────────────────────────────────────
class SectionCreate(BaseModel):
    course_id: UUID
    title: str = Field(..., max_length=255)
    section_order: int = Field(..., ge=1)


class SectionUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    section_order: int | None = Field(None, ge=1)


# ─── READ ────────────────────────────────────────────
class SectionReadBase(ORMBase):
    id: int
    course_id: UUID
    title: str
    section_order: int


class SectionRead(SectionReadBase):
    lessons: List[LessonRead] = []
