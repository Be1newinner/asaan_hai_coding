from app.crud.base import CRUDBase
from app.models.section import Section
from app.schemas.section import SectionCreate, SectionUpdate

section_crud = CRUDBase[Section, SectionCreate, SectionUpdate](Section)
