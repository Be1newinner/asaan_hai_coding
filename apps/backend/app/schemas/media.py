from datetime import datetime
from typing import Optional, List, Sequence
from uuid import UUID
from pydantic import BaseModel, Field
from enum import Enum


# Match SQLAlchemy enum
class MediaType(str, Enum):
    image = "image"
    video = "video"


# Base schema (shared fields)
class MediaBase(BaseModel):
    public_id: str = Field(..., max_length=255)
    resource_type: MediaType
    format: Optional[str] = Field(None, max_length=32)
    version: Optional[int] = None

    secure_url: str = Field(..., max_length=1024)
    url: Optional[str] = Field(None, max_length=1024)

    content_type: Optional[str] = Field(None, max_length=100)
    bytes: int = Field(..., ge=0)
    width: Optional[int] = Field(None, gt=0)
    height: Optional[int] = Field(None, gt=0)
    duration_ms: Optional[int] = None

    folder: Optional[str] = Field(None, max_length=255)
    original_filename: Optional[str] = Field(None, max_length=255)

    title: Optional[str] = Field(None, max_length=255)
    alt_text: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None

    is_published: bool = False
    is_deleted: bool = False

    deleted_at: Optional[datetime] = None
    deleted_by: Optional[UUID] = None


# Create schema
class MediaCreate(MediaBase):
    """Schema for creating Media"""

    deleted_at: Optional[datetime] = None
    deleted_by: Optional[UUID] = None
    pass


# Update schema (partial fields allowed)
class MediaUpdate(BaseModel):
    public_id: Optional[str] = Field(None, max_length=255)
    resource_type: Optional[MediaType] = None
    format: Optional[str] = Field(None, max_length=32)
    version: Optional[int] = None

    secure_url: Optional[str] = Field(None, max_length=1024)
    url: Optional[str] = Field(None, max_length=1024)

    content_type: Optional[str] = Field(None, max_length=100)
    bytes: Optional[int] = Field(None, ge=0)
    width: Optional[int] = Field(None, gt=0)
    height: Optional[int] = Field(None, gt=0)
    duration_ms: Optional[int] = None

    folder: Optional[str] = Field(None, max_length=255)
    original_filename: Optional[str] = Field(None, max_length=255)

    title: Optional[str] = Field(None, max_length=255)
    alt_text: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None

    is_published: Optional[bool] = None
    is_deleted: Optional[bool] = None

    deleted_at: Optional[datetime] = None
    deleted_by: Optional[UUID] = None


# Read single record schema
class MediaRead(MediaBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Read list schema
class MediaReadList(BaseModel):
    items: Sequence[MediaRead]
    total: int


# Delete schema (just an identifier)
class MediaDelete(BaseModel):
    id: UUID
