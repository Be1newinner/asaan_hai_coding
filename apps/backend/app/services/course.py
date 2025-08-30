from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Load, selectinload, joinedload

from app.services.base import CRUDBase
from app.models.course import Course
from app.models.section import Section
from app.models.user import User
from app.models.media import Media
from app.schemas.course import CourseCreate, CourseUpdate

from uuid import UUID

# from typing import Iterable, Any


class CourseCRUD(CRUDBase[Course, CourseCreate, CourseUpdate]):
    """Domain-specific queries live here."""

    async def list_published(self, db: AsyncSession, *, skip: int = 0, limit: int = 20):
        print(" ------------ DATA START ------------ ")
        stmt = (
            select(self.model)
            .options(
                selectinload(Course.instructor).load_only(
                    User.id, User.full_name, User.email
                )
            )
            .where(self.model.is_published.is_(True))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(stmt)
        data = result.scalars().all()
        print(data)
        print(" ------------ DATA END ------------ ")
        return data

    async def getDetailed(self, db: AsyncSession, obj_id: int | UUID):
        forced = (
            selectinload(self.model.sections).selectinload(Section.lessons),
            selectinload(self.model.instructor).load_only(
                User.id, User.full_name, User.email
            ),
            joinedload(self.model.image).load_only(Media.id, Media.url),
        )
        return await super().get(db, obj_id, forced)


course_crud = CourseCRUD(Course)
