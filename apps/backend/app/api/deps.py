from fastapi import Depends, HTTPException, status
from fastapi.security import (
    # OAuth2PasswordBearer,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_async_session
from app.services import user_crud
from app.schemas.auth import TokenPayload


# Password Bearer
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
security_scheme = HTTPBearer()


def require_role(allowed_roles: list[str]):
    async def _require(
        # token: str = Depends(oauth2_scheme), # this is for username and password for token
        token_obj: HTTPAuthorizationCredentials = Depends(
            security_scheme
        ),  # this is for passing bearer token directly
        db: AsyncSession = Depends(get_async_session),
    ):
        # print({"token": token.model_dump().get("credentials")})
        # return token
        
        token = token_obj.credentials
        if not token:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
            )
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


async def extract_token(
    token_obj: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> TokenPayload:
    token = token_obj.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )
    return TokenPayload(**payload)


get_current_admin = require_role(["ADMIN"])
