from app.db.base import BaseModel
from sqlalchemy import String, Text, Boolean, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.project_detail import ProjectDetail


class Project(BaseModel):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    client_name: Mapped[str | None] = mapped_column(String(100))
    project_type: Mapped[str | None] = mapped_column(String(50))
    thumbnail_url: Mapped[str | None] = mapped_column(String(255))
    live_demo_url: Mapped[str | None] = mapped_column(String(255))
    github_url: Mapped[str | None] = mapped_column(String(255))
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), default=datetime.now
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    detail: Mapped["ProjectDetail"] = relationship(
        back_populates="project", uselist=False, cascade="all, delete-orphan"
    )