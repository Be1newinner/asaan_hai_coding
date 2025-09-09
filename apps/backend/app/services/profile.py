from app.services.base import CRUDBase
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Iterable, Any, Optional
from uuid import UUID
from sqlalchemy.orm import selectinload
from app.utils.update_helpers import (
    _update_one_to_many_inplace,
    _relationship_names,
    _relationship_prop,
    _assign_many_to_many_by_ids,
)


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

    async def update_with_rules(
        self,
        db: AsyncSession,
        db_obj: Any,
        obj_in: Any,
    ) -> Any:
        payload = obj_in.model_dump(exclude_unset=True)

        model_cls = type(db_obj)
        rel_names = _relationship_names(model_cls)

        # 1) handling many-to-many - e.g. technical_skill_ids
        if "technical_skill_ids" in payload:
            ids = payload.pop("technical_skill_ids") or []
            rel_name = "technical_skills"
            rel_prop = _relationship_prop(model_cls, rel_name)
            target_model = rel_prop.mapper.class_
            await _assign_many_to_many_by_ids(db, db_obj, rel_name, target_model, ids)

        # 2) handling one-to-many nested collections (diff/patch)
        # avoiding many-to-one or scalar relationships
        for field in list(payload.keys()):
            if field in rel_names:
                rel_prop = _relationship_prop(model_cls, field)
                if rel_prop.uselist:
                    incoming = payload.pop(field)
                    if incoming is not None:
                        _update_one_to_many_inplace(
                            db_obj,
                            field,
                            incoming=incoming,
                            scalar_fields=None,
                            replace=True,
                        )
                else:
                    pass

        # 3) set scalar columns
        for field, value in payload.items():
            if field not in rel_names:
                setattr(db_obj, field, value)

        # 4) commit/refresh
        try:
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except Exception:
            await db.rollback()
            raise


profile_service = ProfileService()
