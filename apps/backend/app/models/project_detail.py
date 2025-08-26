from app.db.base import BaseModel
from sqlalchemy import Text, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.project import Project


class ProjectDetail(BaseModel):
    __tablename__ = "project_details"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), unique=True, nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    tech_stack: Mapped[str | None] = mapped_column(String(255))

    project: Mapped["Project"] = relationship(back_populates="detail")
