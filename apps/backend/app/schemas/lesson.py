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
class LessonReadBase(ORMBase):
    id: int
    section_id: int
    title: str
    lesson_order: int
    
class LessonRead(LessonReadBase):
    content: str | None
