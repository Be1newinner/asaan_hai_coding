from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import cast

from app.api import all_apis
from app.core.config import settings
from app.db.init_db import init_db
from contextlib import asynccontextmanager


# ─── Lifespan handler ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=cast(str, settings.BACKEND_CORS_ORIGINS or ["*"]),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include routers ─────────────────────────────────────────────
for r in all_apis:
    app.include_router(r)
