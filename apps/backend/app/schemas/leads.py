from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from datetime import datetime
from typing import Generic, TypeVar


class LeadCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None

    @field_validator("phone", "subject", "message", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v

    @model_validator(mode="after")
    def ensure_email_or_phone(self):
        if not (self.email or (self.phone and self.phone.strip())):
            raise ValueError("Provide at least one of email or phone.")
        return self


class LeadRead(BaseModel):
    id: int
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class LeadListItem(LeadRead):
    pass


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None

    @field_validator("phone", "subject", "message", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if isinstance(v, str) and v.strip() == "":
            return None
        return v


class LeadPatch(LeadUpdate):
    pass


T = TypeVar("T")


class ResponseEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: T


class Paginated(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int
