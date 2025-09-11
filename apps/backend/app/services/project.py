from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.base import CRUDBase
from app.models.project import Project
from app.models.project_detail import ProjectDetail
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectDetailCreate,
    ProjectDetailUpdate,
)
from typing import Iterable, Any

from app.models.media import Media


class ProjectCRUD(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    """Project-level helpers (publish filter, etc.)."""

    async def list_published(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 1001,
        projection: list[str] | None = None,
        filter_by_key_value: dict[str, Any] | None = None,
        options: Iterable[Any] = (),
    ):
        mapping = {**(filter_by_key_value or {}), "is_published": True}
        return await super().list(
            db,
            skip=skip,
            limit=limit,
            projection=projection,
            filter_by_key_value=mapping,
            options=(
                selectinload(Project.technologies),
                selectinload(Project.features),
                selectinload(Project.tags),
                selectinload(Project.gallery_medias),
                selectinload(Project.thumbnail_image),
                *options,
            ),
        )

    async def get_detailed(self, db: AsyncSession, obj_id: int):
        forced = (
            selectinload(Project.detail),
            selectinload(Project.technologies),
            selectinload(Project.features),
            selectinload(Project.tags),
            selectinload(Project.gallery_medias),
            joinedload(self.model.thumbnail_image).load_only(
                Media.id, Media.secure_url
            ),
        )
        return await self.get(db, obj_id, forced)


project_crud = ProjectCRUD(Project)

project_detail_crud = CRUDBase[ProjectDetail, ProjectDetailCreate, ProjectDetailUpdate](
    ProjectDetail
)
