from app.services.base import CRUDBase
from app.models.section import Section
from app.schemas.section import SectionCreate, SectionUpdate


class SectionCrud(CRUDBase[Section, SectionCreate, SectionUpdate]):
    pass


section_crud = SectionCrud(Section)
