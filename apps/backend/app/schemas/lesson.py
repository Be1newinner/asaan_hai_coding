from pydantic import BaseModel, Field
from app.schemas.base import ORMBase


# ─── WRITE ──────────────────────────────────────────
class LessonCreate(BaseModel):
    section_id: int
    title: str = Field(..., max_length=255)
    content: str | None = None
    lesson_order: int = Field(..., ge=1)


class LessonUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    content: str | None = None
    lesson_order: int | None = Field(None, ge=1)


# ─── READ ───────────────────────────────────────────
class LessonRead(ORMBase):
    id: int
    section_id: int
    title: str
    content: str | None
    lesson_order: int
