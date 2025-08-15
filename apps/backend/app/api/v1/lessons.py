from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.lesson import LessonCreate, LessonUpdate, LessonRead
from app.crud import lesson_crud
from app.api.deps import get_current_admin
from app.db.session import get_async_session

router = APIRouter(prefix="/lessons", tags=["lessons"])


# ─── Public / shared endpoints ───────────────────────────────────
@router.get("", response_model=list[LessonRead])
async def list_lessons(
    section_id: int = Query(..., description="Filter by parent section"),
    db: AsyncSession = Depends(get_async_session),
):
    return (
        await lesson_crud.list(db, skip=0, limit=500)
        if section_id is None
        else [l for l in await lesson_crud.list(db) if l.section_id == section_id]
    )


@router.get("/{lesson_id}", response_model=LessonRead)
async def get_lesson(lesson_id: int, db: AsyncSession = Depends(get_async_session)):
    lesson = await lesson_crud.get(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


# ─── Admin endpoints ─────────────────────────────────────────────
@router.post(
    "",
    response_model=LessonRead,
    dependencies=[Depends(get_current_admin)],
)
async def create_lesson(
    data: LessonCreate, db: AsyncSession = Depends(get_async_session)
):
    return await lesson_crud.create(db, data)


@router.put(
    "/{lesson_id}",
    response_model=LessonRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_lesson(
    lesson_id: int,
    data: LessonUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    lesson = await lesson_crud.get(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return await lesson_crud.update(db, lesson, data)


@router.delete(
    "/{lesson_id}", dependencies=[Depends(get_current_admin)], status_code=204
)
async def delete_lesson(lesson_id: int, db: AsyncSession = Depends(get_async_session)):
    await lesson_crud.delete(db, lesson_id)
