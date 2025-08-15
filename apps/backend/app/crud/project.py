from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.project import Project, ProjectDetail
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectDetailCreate,
    ProjectDetailUpdate,
)


class ProjectCRUD(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    """Project-level helpers (publish filter, etc.)."""

    async def list_published(self, db: AsyncSession, *, skip: int = 0, limit: int = 20):
        stmt = (
            select(self.model)
            .where(self.model.is_published.is_(True))
            .offset(skip)
            .limit(limit)
        )
        res = await db.execute(stmt)
        return res.scalars().all()


project_crud = ProjectCRUD(Project)

project_detail_crud = CRUDBase[ProjectDetail, ProjectDetailCreate, ProjectDetailUpdate](
    ProjectDetail
)
