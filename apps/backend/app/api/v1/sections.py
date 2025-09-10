from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.schemas.section import (
    SectionCreate,
    SectionUpdate,
    SectionRead,
    SectionReadBase,
)
from app.services import section_crud
from app.api.deps import get_current_admin
from app.db.session import get_async_session

from typing import List

router = APIRouter(prefix="/sections", tags=["Sections"])


# ─── Public / shared endpoints ───────────────────────────────────
@router.get("", response_model=list[SectionReadBase])
async def list_sections(
    course_id: UUID = Query(..., description="Filter by parent course"),
    db: AsyncSession = Depends(get_async_session),
):
    if course_id is None:
        return await section_crud.list(db, skip=0, limit=500)
    else:
        return [s for s in await section_crud.list(db) if s.course_id == course_id]


@router.get("/{section_id}", response_model=SectionRead)
async def get_section(section_id: int, db: AsyncSession = Depends(get_async_session)):
    section = await section_crud.get(db, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


# ─── Admin endpoints ─────────────────────────────────────────────
@router.post(
    "",
    response_model=SectionRead,
    dependencies=[Depends(get_current_admin)],
)
async def create_section(
    data: SectionCreate, db: AsyncSession = Depends(get_async_session)
):
    return await section_crud.create(db, data)


@router.post(
    "/bulk",
    response_model=list[SectionReadBase],
    dependencies=[Depends(get_current_admin)],
)
async def create_sections_bulk(
    data: List[SectionCreate], db: AsyncSession = Depends(get_async_session)
):
    return await section_crud.create_bulk(db, data)


@router.put(
    "/{section_id}",
    response_model=SectionRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_section(
    section_id: int,
    data: SectionUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    section = await section_crud.get(db, section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return await section_crud.update(db, section, data)


@router.delete(
    "/{section_id}", dependencies=[Depends(get_current_admin)], status_code=204
)
async def delete_section(
    section_id: int, db: AsyncSession = Depends(get_async_session)
):
    await section_crud.delete(db, section_id)
