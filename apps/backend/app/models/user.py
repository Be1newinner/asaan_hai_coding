from app.db.base import BaseModel
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    MODERATOR = "MODERATOR"


class UserGender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class User(BaseModel):
    __tablename__ = "users"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
