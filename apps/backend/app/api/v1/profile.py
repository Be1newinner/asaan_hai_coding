from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileRead
from app.services.profile import profile_service
from app.db.session import get_async_session

from app.api.deps import get_current_admin


router = APIRouter(prefix="/profile", tags=["Team Profile"])


@router.get("/{id}", response_model=ProfileRead)
async def get_profile(id: int, db: AsyncSession = Depends(get_async_session)):
    profile_data = await profile_service.get(db, id)
    if not profile_data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile_data


@router.post("/", response_model=ProfileRead, dependencies=[Depends(get_current_admin)])
async def create_profile(
    profile_create: ProfileCreate,
    db: AsyncSession = Depends(get_async_session),
):
    return await profile_service.create(db, profile_create)


@router.patch("/{id}")
async def update_profile(
    profile_update: ProfileUpdate,
    id: int,
    db: AsyncSession = Depends(get_async_session),
):
    profile_data = await profile_service.get(db, id)
    if not profile_data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return await profile_service.update(db, profile_data, profile_update)
