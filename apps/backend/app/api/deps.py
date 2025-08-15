from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_async_session
from app.models.user import User
from app.crud import user_crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def require_role(allowed_roles: list[str]):
    async def _require(
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_async_session),
    ) -> User:
        payload = decode_access_token(token)
        if not payload or payload.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
            )
        user = await user_crud.get(db, payload["sub"])
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    return _require


get_current_admin = require_role(["ADMIN"])
