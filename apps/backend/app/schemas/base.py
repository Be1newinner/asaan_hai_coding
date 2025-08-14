# app/schemas/base.py
from datetime import datetime
from pydantic import BaseModel, Field


class ORMBase(BaseModel):
    """Common config so Pydantic can read SQLAlchemy objects directly."""

    model_config = {"from_attributes": True}


class TimestampMixin(BaseModel):
    created_at: datetime | None = Field(None, description="Creation time (UTC)")
    updated_at: datetime | None = Field(None, description="Last update time (UTC)")
