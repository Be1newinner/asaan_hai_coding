from typing import TYPE_CHECKING, Optional
from pydantic import EmailStr
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, CheckConstraint
from app.db.base import BaseModel
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP


class Leads(BaseModel):
    __tablename__ = "leads"
    __table_args__ = (
        CheckConstraint(
            "(email IS NOT NULL) OR (phone IS NOT NULL)",
            name="ck_leads_email_or_phone_present",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[EmailStr]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )
