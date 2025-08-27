from pydantic import BaseModel, Field
from uuid import UUID


class AuthLoginIn(BaseModel):
    username: str = Field(..., examples=["admin"])
    password: str = Field(..., examples=["S3cretP@ss"])


class TokenPayload(BaseModel):
    sub: UUID
    username: str
    role: str
    iss: str
    aud: str
    exp: int
    iat: int


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshToken(BaseModel):
    refresh_token: str