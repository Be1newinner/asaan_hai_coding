from typing import TYPE_CHECKING

from app.db.base import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Integer, ForeignKey

if TYPE_CHECKING:
    from app.models.section import Section


class Lesson(BaseModel):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    section_id: Mapped[int] = mapped_column(
        ForeignKey("sections.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    lesson_order: Mapped[int] = mapped_column(Integer, nullable=False)

    section: Mapped["Section"] = relationship(back_populates="lessons")