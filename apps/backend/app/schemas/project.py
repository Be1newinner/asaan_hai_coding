from datetime import datetime
from typing import Optional, Any

from pydantic import BaseModel, Field
from app.schemas.base import ORMBase, TimestampMixin


# ──────────────────────────────
# Project-Detail Schemas
# ──────────────────────────────
class ProjectDetailCreate(BaseModel):
    markdown_content: str = Field(..., description="Full markdown case-study")


class ProjectDetailUpdate(BaseModel):
    markdown_content: str | None = None


class ProjectDetailRead(ORMBase):
    markdown_content: str


# ──────────────────────────────
# Project Schemas
# ──────────────────────────────
class ProjectCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: str | None = None
    client_name: str | None = Field(None, max_length=100)
    project_type: str | None = Field(None, max_length=50)
    thumbnail_url: str | None = Field(None, max_length=255)
    live_demo_url: str | None = Field(None, max_length=255)
    github_url: str | None = Field(None, max_length=255)
    is_published: bool = False


class ProjectUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    description: str | None = None
    client_name: str | None = Field(None, max_length=100)
    project_type: str | None = Field(None, max_length=50)
    thumbnail_url: str | None = Field(None, max_length=255)
    live_demo_url: str | None = Field(None, max_length=255)
    github_url: str | None = Field(None, max_length=255)
    is_published: bool | None = None


class ProjectRead(ORMBase, TimestampMixin):
    id: int
    title: str
    description: str | None
    client_name: str | None
    project_type: str | None
    thumbnail_url: str | None
    live_demo_url: str | None
    github_url: str | None
    is_published: bool

class ProjectReadDetailed(ProjectRead):
    detail: Optional[Any]
