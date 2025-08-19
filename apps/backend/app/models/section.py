from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from app.db.base import BaseModel
from uuid import UUID

if TYPE_CHECKING:
    from app.models.lesson import Lesson
    from app.models.course import Course


class Section(BaseModel):
    __tablename__ = "sections"
    __table_args__ = (
        UniqueConstraint("course_id", "section_order", name="uq_section_course_order"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id: Mapped[UUID] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    section_order: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relations
    course: Mapped["Course"] = relationship(
        back_populates="sections",
        lazy="selectin",
    )
    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="section",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
