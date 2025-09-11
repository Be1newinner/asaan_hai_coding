from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Load, selectinload, joinedload

from app.services.base import CRUDBase
from app.models.course import Course
from app.models.section import Section
from app.models.user import User
from app.models.media import Media
from app.schemas.course import CourseCreate, CourseUpdate

# from sqlalchemy.orm import selectinload, load_only

from uuid import UUID


class CourseCRUD(CRUDBase[Course, CourseCreate, CourseUpdate]):
    async def list_published(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 20,
    ):
        # 1) Base filtered statement (no pagination)
        base = (
            select(self.model)
            .options(
                selectinload(Course.instructor).load_only(
                    User.id, User.full_name, User.email
                )
            )
            .where(self.model.is_published.is_(True))
        )

        # 2) Page of data
        page_stmt = base.offset(skip).limit(limit)
        result = await db.execute(page_stmt)
        items = result.scalars().all()

        # 3) Total count (remove ORDER BY if any to speed up)
        count_stmt = select(func.count()).select_from(base.order_by(None).subquery())
        total = await db.scalar(count_stmt)

        return {"items": items, "total": total, "skip": skip, "limit": limit}

    async def getDetailed(self, db: AsyncSession, obj_id: int | UUID):
        forced = (
            selectinload(self.model.sections).selectinload(Section.lessons),
            selectinload(self.model.instructor).load_only(
                User.id, User.full_name, User.email
            ),
            joinedload(self.model.image).load_only(Media.id, Media.secure_url),
        )
        return await super().get(db, obj_id, forced)


course_crud = CourseCRUD(Course)
