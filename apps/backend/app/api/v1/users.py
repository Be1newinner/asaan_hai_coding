from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.user import UserCreate, UserUpdate, UserRead
from app.crud import user_crud
from app.api.deps import get_current_admin
from app.db.session import get_async_session

router = APIRouter(
    prefix="/users", tags=["users"], dependencies=[Depends(get_current_admin)]
)


@router.put("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int,
    data: UserUpdate,
    db: AsyncSession = Depends(get_async_session),
):
    user = await user_crud.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await user_crud.update(db, user, data)


@router.get("", response_model=list[UserRead])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_async_session),
):
    return await user_crud.list(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, db: AsyncSession = Depends(get_async_session)):
    user = await user_crud.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("", response_model=UserRead)
async def create_user(data: UserCreate, db: AsyncSession = Depends(get_async_session)):
    return await user_crud.create(db, data)


@router.post("", response_model=List[UserRead])
async def create_user_bulk(
    data_list: List[UserCreate], db: AsyncSession = Depends(get_async_session)
):
    return await user_crud.create_bulk(db, data_list)


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_async_session)):
    await user_crud.delete(db, user_id)
