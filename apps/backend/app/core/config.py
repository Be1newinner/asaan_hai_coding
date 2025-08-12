from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "ASAAN HAI CODING"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str 
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # 1 hour
    ALGORITHM: str = "HS256"

    FIRST_SUPERUSER: str | None = None
    FIRST_SUPERUSER_PASSWORD: str | None = None
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)