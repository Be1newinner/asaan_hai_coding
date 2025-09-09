from app.services.base import CRUDBase
from app.schemas.profile import SkillCreate, SkillUpdate
from app.models.profile import Skill


class SkillService(CRUDBase[Skill, SkillCreate, SkillUpdate]):
    def __init__(self):
        super().__init__(Skill)


skill_service = SkillService()
