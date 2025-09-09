from fastapi import Depends, HTTPException, status, Request
from fastapi.security import (
    # OAuth2PasswordBearer,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token, decode_refresh_token
from app.db.session import get_async_session
from app.services import user_crud
from app.schemas.auth import TokenPayload


# Password Bearer
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
security_scheme = HTTPBearer()


def require_role(allowed_roles: list[str]):
    async def _require(
        token_obj: HTTPAuthorizationCredentials = Depends(security_scheme),
        db: AsyncSession = Depends(get_async_session),
    ):
        token = token_obj.credentials
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="missing_access_token",
                headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
            )

        res = decode_access_token(token)  # structured decode result
        if not res.get("ok", False):
            reason = res.get("reason")
            if reason == "expired":
                # signal client to use refresh token
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="access_token_expired",
                    headers={
                        "WWW-Authenticate": 'Bearer error="invalid_token", error_description="expired"'
                    },
                )
            # other invalid token cases
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="invalid_access_token",
                headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
            )

        claims = res["claims"] or {}
        role = claims.get("role")
        if allowed_roles and role not in allowed_roles:
            # authenticated but not allowed
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="forbidden",
            )

        user_id = claims.get("sub") or claims.get("user_id") or claims.get("claims")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="invalid_access_token",
                headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
            )

        user = await user_crud.get(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="user_not_found"
            )

        return user

    return _require


async def extract_token(
    token_obj: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> TokenPayload:
    token = token_obj.credentials
    if not token:
        # Authentication error: missing credentials
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="missing_access_token",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )

    res = decode_access_token(token)
    if not res.get("ok", False):
        reason = res.get("reason")
        if reason == "expired":
            # Signal client to use refresh token
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="access_token_expired",
                headers={
                    "WWW-Authenticate": 'Bearer error="invalid_token", error_description="expired"'
                },
            )
        # Other token problems: bad signature, invalid claims, decode errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid_access_token",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )

    claims = res["claims"] or {}
    return TokenPayload(**claims)


async def extract_refresh_token(request: Request) -> TokenPayload:
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        # No credentials present -> 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="missing_refresh_token",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )

    res = decode_refresh_token(
        refresh_token
    )  # {"ok": bool, "claims": dict|None, "reason": str|None}
    if not res.get("ok", False):
        reason = res.get("reason")
        if reason == "expired":
            # Refresh token expired -> user must re-authenticate
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="refresh_token_expired",
                headers={
                    "WWW-Authenticate": 'Bearer error="invalid_token", error_description="expired"'
                },
            )
        # Any other issue means the refresh token is invalid/tampered/claims mismatch
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid_refresh_token",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )

    claims = res["claims"] or {}
    return TokenPayload(**claims)


get_current_admin = require_role(["ADMIN"])
