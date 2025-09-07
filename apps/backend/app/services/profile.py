from app.services.base import CRUDBase
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Iterable, Any, Optional
from uuid import UUID
from sqlalchemy.orm import selectinload


class ProfileService(CRUDBase[Profile, ProfileCreate, ProfileUpdate]):
    def __init__(self) -> None:
        super().__init__(Profile)

    async def get(
        self,
        db: AsyncSession,
        obj_id: int | UUID,
        options: Iterable[Any] = (),
    ) -> Optional[Profile]:
        forced = (
            selectinload(self.model.profile_image),
            selectinload(self.model.support_links),
            selectinload(self.model.achievements),
            selectinload(self.model.experiences),
            selectinload(self.model.technical_skills),
        )
        return await super().get(db, obj_id, forced)


profile_service = ProfileService()
