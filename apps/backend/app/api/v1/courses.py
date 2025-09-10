from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


from app.schemas.course import CourseCreate, CourseUpdate, CourseRead, CourseReadBase
from app.services import course_crud
from app.api.deps import get_current_admin
from app.db.session import get_async_session
from uuid import UUID

from typing import List

router = APIRouter(prefix="/courses", tags=["Courses"])


# ─── Public endpoints ────────────────────────────────────────────
@router.get("", response_model=list[CourseReadBase])
async def list_courses(
    skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_async_session)
):
    return await course_crud.list_published(db, skip=skip, limit=limit)


@router.get("/{course_id}", response_model=CourseRead)
async def get_course(course_id: UUID, db: AsyncSession = Depends(get_async_session)):
    course = await course_crud.getDetailed(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
        )
    return course


# ─── Admin endpoints ─────────────────────────────────────────────
@router.post("", response_model=CourseRead, dependencies=[Depends(get_current_admin)])
async def create_course(
    data: CourseCreate,
    db: AsyncSession = Depends(get_async_session),
):
    new_course = await course_crud.create(db, data)
    detailed_course = await course_crud.getDetailed(db, new_course.id)
    return detailed_course


@router.post(
    "/bulk",
    response_model=list[CourseReadBase],
    dependencies=[Depends(get_current_admin)],
)
async def create_courses_bulk(
    data: List[CourseCreate],
    db: AsyncSession = Depends(get_async_session),
):
    return await course_crud.create_bulk(db, data)


@router.put(
    "/{course_id}", response_model=CourseRead, dependencies=[Depends(get_current_admin)]
)
async def update_course(
    course_id: UUID,
    data: CourseUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    course = await course_crud.get(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Course not found"
        )

    await course_crud.update(db, course, data)
    updated_course = await course_crud.getDetailed(db, course_id)
    if not updated_course:
        raise HTTPException(
            status_code=404, detail="Course could not be found after update"
        )
    return updated_course


@router.delete(
    "/{course_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin)],
)
async def delete_course(course_id: UUID, db: AsyncSession = Depends(get_async_session)):
    await course_crud.delete(db, course_id)
    return
