from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.auth import TokenOut, TokenPayload
from app.schemas.user import UserRead, UserUpdateByAdmin
from app.core.security import verify_password, get_password_hash, create_access_token
from app.db.session import get_async_session
from app.models.user import User

from app.crud.user import user_crud
from app.api.deps import extract_token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
async def login(
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
    token = create_access_token(
        {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
            "iss": "ahc-backend",
            "aud": "ahc-admin",
        }
    )
    return {"access_token": token, "token_type": "bearer"}


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
