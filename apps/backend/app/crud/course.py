from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate


class CourseCRUD(CRUDBase[Course, CourseCreate, CourseUpdate]):
    """Domain-specific queries live here."""

    async def list_published(self, db: AsyncSession, *, skip: int = 0, limit: int = 20):
        stmt = (
            select(self.model)
            .where(self.model.is_published.is_(True))
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(stmt)
        return result.scalars().all()


course_crud = CourseCRUD(Course)
