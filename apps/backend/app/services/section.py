from app.services.base import CRUDBase
from app.models.section import Section
from app.schemas.section import SectionCreate, SectionUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi.exceptions import HTTPException
from fastapi import status


class SectionCrud(CRUDBase[Section, SectionCreate, SectionUpdate]):
    pass


section_crud = SectionCrud(Section)
