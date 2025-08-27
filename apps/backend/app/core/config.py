from typing import List, Union
from pydantic import AnyHttpUrl, field_validator, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import json
import sys
import cloudinary


class Settings(BaseSettings):
    PROJECT_NAME: str = "Asaan Hai Coding Backend"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str = ""

    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 21
    ALGORITHM: str = "HS256"
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str | None = None

    BACKEND_CORS_ORIGINS: List[str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        """Parse CORS origins from JSON string or return as-is if already list."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            if isinstance(v, str):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    return []
            return v
        raise ValueError(v)

    FIRST_SUPERUSER: str | None = None
    FIRST_SUPERUSER_PASSWORD: str | None = None

    CLOUDINARY_URL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow",
        env_file_encoding="utf-8",
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance to avoid reloading .env on every import.
    Validates that required environment variables are present.
    """
    try:
        settings = Settings()
        cloudinary.config(
            cloud_name="decvnwos9",
            api_key="428768583138577",
            api_secret="PJAI5UKNfOCvKi2ar8QpxEslSnA",
        )
        return settings
    except ValidationError as e:
        print(f"❌ Configuration Error: {e}")
        sys.exit(1)


settings = get_settings()


def validate_environment() -> bool:
    """Validate that all required environment variables are set."""
    try:
        get_settings()
        return True
    except ValidationError:
        return False


if __name__ == "__main__":
    print(f"✅ Configuration loaded successfully!")
