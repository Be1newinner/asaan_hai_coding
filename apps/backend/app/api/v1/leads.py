from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.leads import LeadCreate, LeadUpdate, LeadRead, LeadListItem
from app.services.leads import leads_crud
from app.api.deps import get_current_admin
from app.db.session import get_async_session
from typing import List

router = APIRouter(prefix="/leads", tags=["Leads"])


# ─── Public / shared endpoints ───────────────────────────────────
@router.get("", response_model=LeadListItem)
async def list_leads(
    db: AsyncSession = Depends(get_async_session),
    skip: int = 0,
    limit: int = 10,
):
    return await leads_crud.list(db, skip=skip, limit=limit)


@router.get("/{lead_id}", response_model=LeadRead)
async def get_lead_by_id(lead_id: int, db: AsyncSession = Depends(get_async_session)):
    lead = await leads_crud.get(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


# ─── Admin endpoints ─────────────────────────────────────────────
@router.post(
    "",
    response_model=LeadRead,
    dependencies=[Depends(get_current_admin)],
)
async def create_lead(data: LeadCreate, db: AsyncSession = Depends(get_async_session)):
    return await leads_crud.create(db, data)


@router.post(
    "/bulk",
    response_model=LeadListItem,
    dependencies=[Depends(get_current_admin)],
)
async def create_leads_bulk(
    data_list: List[LeadCreate], db: AsyncSession = Depends(get_async_session)
):
    return await leads_crud.create_bulk(db, data_list)


@router.put(
    "/{lead_id}",
    response_model=LeadRead,
    dependencies=[Depends(get_current_admin)],
)
async def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    lead = await leads_crud.get(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="lead not found")
    return await leads_crud.update(db, lead, data)


@router.delete("/{lead_id}", dependencies=[Depends(get_current_admin)], status_code=204)
async def delete_lead(lead_id: int, db: AsyncSession = Depends(get_async_session)):
    await leads_crud.delete(db, lead_id)
