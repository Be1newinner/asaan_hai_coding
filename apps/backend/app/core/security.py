from app.core.config import get_settings
from bcrypt import gensalt, hashpw, checkpw
from typing import Union, Optional
from authlib.jose import JsonWebToken, errors, JWTClaims
from datetime import timedelta, datetime, timezone
from app.schemas.auth import TokenPayload

settings = get_settings()

JWT_ALGORITHM = "HS256"

jwt = JsonWebToken([JWT_ALGORITHM])


def verify_password(plain_password: str, hashed_password: Union[str, bytes]) -> bool:
    plain_bytes: bytes
    hashed_bytes: bytes
    if isinstance(plain_password, str):
        plain_bytes = plain_password.encode("utf-8")
    if isinstance(hashed_password, str):
        hashed_bytes = hashed_password.encode("utf-8")
    else:
        hashed_bytes = hashed_password
    return checkpw(password=plain_bytes, hashed_password=hashed_bytes)


def get_password_hash(plain_password: str) -> str:
    password_bytes = plain_password.encode("utf-8")
    salt = gensalt(rounds=12)
    hashed_password = hashpw(password_bytes, salt)
    return hashed_password.decode("utf-8")


def create_access_token(data: dict, expire_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(tz=timezone.utc)
    expire = now + (
        expire_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update(
        {
            "exp": expire,
            "iat": now,
            "iss": "ahc-backend",
            "aud": "ahc-admin",
        }
    )
    header = {"alg": JWT_ALGORITHM, "typ": "JWT"}
    token = jwt.encode(header=header, payload=to_encode, key=settings.SECRET_KEY)
    return token.decode("utf-8")


def decode_access_token(token: str) -> Optional[JWTClaims]:
    try:
        return jwt.decode(s=token, key=settings.SECRET_KEY)
    except errors.DecodeError:
        return None
