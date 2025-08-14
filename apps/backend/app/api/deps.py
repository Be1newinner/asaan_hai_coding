from app.core.security import decode_access_token
from fastapi import HTTPException, status, Depends
from app.db.session import get_async_session
from sqlalchemy.future import select
from app.models.user import User

from sqlalchemy.ext.asyncio import AsyncSession


async def get_current_user(
    token: str, session: AsyncSession = Depends(get_async_session)
):
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )
    user_id = payload.get("sub")
    result = await session.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
