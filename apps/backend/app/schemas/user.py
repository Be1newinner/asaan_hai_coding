from pydantic import EmailStr, Field
from app.schemas.base import ORMBase, TimestampMixin
from uuid import UUID, uuid4


# ─── READ ──────────────────────────────────────────
class UserRead(ORMBase, TimestampMixin):
    id: UUID
    username: str
    email: EmailStr
    full_name: str
    contact: str | None
    gender: str | None
    role: str


# ─── WRITE (ADMIN ONLY) ────────────────────────────
class UserCreate(ORMBase):
    username: str = Field(..., max_length=50)
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8)
    role: str | None = "USER"
    gender: str | None = None
    contact: str | None = None


class UserUpdate(ORMBase):
    full_name: str | None = None
    password: str | None = Field(None, min_length=8)
    role: str | None = None
    gender: str | None = None
    contact: str | None = None
