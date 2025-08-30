from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.base import CRUDBase
from app.models.project import Project, ProjectDetail
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectDetailCreate,
    ProjectDetailUpdate,
)

from app.models.media import Media


class ProjectCRUD(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    """Project-level helpers (publish filter, etc.)."""

    async def list_published(self, db: AsyncSession, *, skip: int = 0, limit: int = 20):
        stmt = (
            select(self.model)
            .where(self.model.is_published.is_(True))
            .offset(skip)
            .limit(limit)
            # .options(
            #     joinedload(self.model.thumbnail_image).load_only(
            #         Media.id, Media.secure_url
            #     ),
            # )
        )
        res = await db.execute(stmt)
        return res.scalars().all()

    async def get_detailed(self, db: AsyncSession, obj_id: int):
        forced = (
            selectinload(Project.detail),
            joinedload(self.model.thumbnail_image).load_only(
                Media.id, Media.secure_url
            ),
        )
        return await self.get(db, obj_id, forced)


project_crud = ProjectCRUD(Project)

project_detail_crud = CRUDBase[ProjectDetail, ProjectDetailCreate, ProjectDetailUpdate](
    ProjectDetail
)
