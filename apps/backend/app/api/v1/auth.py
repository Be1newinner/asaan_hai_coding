from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.auth import TokenOut, TokenPayload
from app.schemas.user import UserRead, UserUpdateByAdmin
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
)
from app.db.session import get_async_session
from app.models.user import User

from app.services.user import user_crud
from app.api.deps import extract_token

from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
async def login(
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_session),
):
    stmt = select(User).where(User.username == form.username)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials"
        )
    access_token = create_access_token(
        {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
            "iss": "ahc-backend",
            "aud": "ahc-admin",
        }
    )
    refresh_token = create_refresh_token(
        {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
            "iss": "ahc-backend",
            "aud": "ahc-admin",
        }
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        # domain="www.asaanhaicoding.in",
        expires=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.patch("/reset-password")
async def reset_password(
    form: OAuth2PasswordRequestForm = Depends(),
    token_payload: TokenPayload = Depends(extract_token),
    db: AsyncSession = Depends(get_async_session),
):
    token_username = token_payload.username
    if token_username != form.username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials"
        )
    user = await user_crud.get(db, token_payload.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hashed_password = get_password_hash(form.password)
    user_password = UserUpdateByAdmin(password=hashed_password)
    await user_crud.update(db, user, user_password)
    return {"message": "password reset successfully!"}


@router.get("/me", response_model=UserRead)
async def who_am_i(
    token_payload: TokenPayload = Depends(extract_token),
    db: AsyncSession = Depends(get_async_session),
):
    user = await user_crud.get(db, token_payload.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
