from app.core.config import get_settings
from bcrypt import gensalt, hashpw, checkpw
from typing import Union, Optional, TypedDict, Literal
from authlib.jose import JsonWebToken, errors, JWTClaims
from datetime import timedelta, datetime, timezone
from enum import Enum


settings = get_settings()

JWT_ALGORITHM = "HS256"

jwt_options = {
    "iss": "ahc-backend",
    "aud": "ahc-admin",
}


class DecodeResult(TypedDict):
    ok: bool
    claims: JWTClaims | None
    reason: (
        Literal["expired", "bad_signature", "invalid_claim", "decode_error", "other"]
        | None
    )


class TokenType(str, Enum):
    ACCESS_TOKEN = "access_token"
    REFRESH_TOKEN = "refresh_token"


jwt = JsonWebToken([JWT_ALGORITHM])


def verify_password(plain_password: str, password: Union[str, bytes]) -> bool:
    plain_bytes: bytes
    hashed_bytes: bytes
    if isinstance(plain_password, str):
        plain_bytes = plain_password.encode("utf-8")
    if isinstance(password, str):
        hashed_bytes = password.encode("utf-8")
    else:
        hashed_bytes = password
    return checkpw(password=plain_bytes, hashed_password=hashed_bytes)


def get_password_hash(plain_password: str) -> str:
    password_bytes = plain_password.encode("utf-8")
    salt = gensalt(rounds=12)
    password = hashpw(password_bytes, salt)
    return password.decode("utf-8")


def create_access_token(data: dict, expire_delta: Optional[timedelta] = None) -> str:
    # 1
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
            "type": TokenType.ACCESS_TOKEN,
        }
    )
    header = {"alg": JWT_ALGORITHM, "typ": "JWT"}
    token = jwt.encode(header=header, payload=to_encode, key=settings.SECRET_KEY)
    return token.decode("utf-8")


def create_refresh_token(data: dict, expire_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(tz=timezone.utc)
    expire = now + (
        expire_delta or timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update(
        {
            "exp": expire,
            "iat": now,
            "iss": "ahc-backend",
            "aud": "ahc-admin",
            "type": TokenType.REFRESH_TOKEN,
        }
    )
    header = {"alg": JWT_ALGORITHM, "typ": "JWT"}
    token = jwt.encode(header=header, payload=to_encode, key=settings.SECRET_KEY)
    return token.decode("utf-8")


def decode_token(token: str, type: TokenType) -> DecodeResult:
    try:
        # print("TYPE: ", type)
        claims = jwt.decode(
            token,
            key=settings.SECRET_KEY,
            claims_options={
                "exp": {"essential": True},
                "iat": {"essential": True},
                "nbf": {"essential": False},
                "iss": {"essential": True, "value": jwt_options.get("iss")},
                "aud": {"essential": True, "value": jwt_options.get("aud")},
                "type": {"essential": True, "value": type},
            },
        )
        # print("claims: ", claims.validate())
        claims.validate()
        return {"ok": True, "claims": claims, "reason": None}
    except errors.ExpiredTokenError:
        return {"ok": False, "claims": None, "reason": "expired"}
    except errors.BadSignatureError:
        return {"ok": False, "claims": None, "reason": "bad_signature"}
    except errors.InvalidClaimError:
        return {"ok": False, "claims": None, "reason": "invalid_claim"}
    except errors.DecodeError:
        return {"ok": False, "claims": None, "reason": "decode_error"}
    except errors.JoseError:
        return {"ok": False, "claims": None, "reason": "other"}


def decode_access_token(token: str) -> DecodeResult:
    return decode_token(token, TokenType.ACCESS_TOKEN)


def decode_refresh_token(token: str) -> DecodeResult:
    return decode_token(token, TokenType.REFRESH_TOKEN)
