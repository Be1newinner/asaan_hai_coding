from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.auth import TokenOut
from app.core.security import verify_password, create_access_token
from app.db.session import get_async_session
from app.models.user import User

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
