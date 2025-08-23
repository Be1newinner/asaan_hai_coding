from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectRead,
    ProjectDetailCreate,
    ProjectDetailUpdate,
    ProjectDetailRead,
)
from app.services import project_crud, project_detail_crud
from app.api.deps import get_current_admin
from app.db.session import get_async_session

router = APIRouter(prefix="/projects", tags=["projects"])


# ─── Public endpoints ────────────────────────────────────────────
@router.get("", response_model=list[ProjectRead])
async def list_projects(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_async_session),
):
    return await project_crud.list_published(db, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectRead)
async def get_project(project_id: int, db: AsyncSession = Depends(get_async_session)):
    proj = await project_crud.get(db, project_id)
    if not proj or not proj.is_published:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj


# ─── Admin endpoints ─────────────────────────────────────────────
@router.post("", response_model=ProjectRead, dependencies=[Depends(get_current_admin)])
async def create_project(
    data: ProjectCreate, db: AsyncSession = Depends(get_async_session)
):
    return await project_crud.create(db, data)


@router.post(
    "/bulk", response_model=List[ProjectRead], dependencies=[Depends(get_current_admin)]
)
async def create_projects_bulk(
    data_list: List[ProjectCreate], db: AsyncSession = Depends(get_async_session)
):
    return await project_crud.create_bulk(db, data_list)


@router.put(
    "/{project_id}",
    response_model=ProjectRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    proj = await project_crud.get(db, project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return await project_crud.update(db, proj, data)


@router.delete(
    "/{project_id}", dependencies=[Depends(get_current_admin)], status_code=204
)
async def delete_project(
    project_id: int, db: AsyncSession = Depends(get_async_session)
):
    await project_crud.delete(db, project_id)


# ─── Project Detail (markdown) ───────────────────────────────────
@router.get("/{project_id}/detail", response_model=ProjectDetailRead)
async def get_project_detail(
    project_id: int, db: AsyncSession = Depends(get_async_session)
):
    detail = await project_detail_crud.get(db, project_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Detail not found")
    return detail


@router.post(
    "/{project_id}/detail",
    response_model=ProjectDetailRead,
    dependencies=[Depends(get_current_admin)],
)
async def create_project_detail(
    project_id: int,
    data: ProjectDetailCreate,
    db: AsyncSession = Depends(get_async_session),
):
    return await project_detail_crud.create(
        db, data.model_copy(update={"project_id": project_id})
    )


@router.put(
    "/{project_id}/detail",
    response_model=ProjectDetailRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_project_detail(
    project_id: int,
    data: ProjectDetailUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    detail = await project_detail_crud.get(db, project_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Detail not found")
    return await project_detail_crud.update(db, detail, data)
