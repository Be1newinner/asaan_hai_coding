from pydantic import EmailStr, Field
from app.schemas.base import ORMBase, TimestampMixin
from uuid import UUID, uuid4
from enum import Enum
from typing import Optional


# ─── ENUM ──────────────────────────────────────────
class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    MODERATOR = "MODERATOR"


class UserGender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


# ─── READ ──────────────────────────────────────────
class UserRead(ORMBase, TimestampMixin):
    id: UUID
    username: str
    email: EmailStr
    full_name: str
    contact: str | None
    gender: UserGender | None
    role: UserRole


# ─── WRITE (ADMIN OR SAME USER ONLY) ────────────────────────────
class UserCreate(ORMBase):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=8)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=50)
    contact: str | None = Field(min_length=10, max_length=13)
    role: UserRole = UserRole.USER
    gender: UserGender | None = None


class UserUpdate(ORMBase):
    full_name: str | None = Field(default=None, min_length=2, max_length=50)
    gender: UserGender | None = None
    contact: str | None = Field(default=None, min_length=10, max_length=13)


class UserPasswordUpdate(ORMBase):
    password: Optional[str] = Field(default=None, min_length=8)


class UserUpdateByAdmin(UserUpdate, UserPasswordUpdate):
    email: EmailStr | None = None
    role: UserRole | None = None
