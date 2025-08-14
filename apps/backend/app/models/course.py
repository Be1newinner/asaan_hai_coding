from app.db.base import BaseModel
from uuid import UUID
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, Text, ForeignKey, TIMESTAMP, Boolean

from datetime import datetime, timezone

if TYPE_CHECKING:                      
    from app.models.section import Section  


class Course(BaseModel):
    __tablename__ = "courses"

    course_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    instructor_id: Mapped[UUID | None] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="SET NULL")
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.now
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    difficulty_level: Mapped[str | None] = mapped_column(String(20))

    # relations
    sections: Mapped[list["Section"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )
