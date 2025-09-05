from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api import all_apis
from app.core.config import settings
from app.db.init_db import init_db

from contextlib import asynccontextmanager

import logging


# ─── Lifespan handler ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.3.2",
    docs_url="/",
    lifespan=lifespan,
)

log = logging.getLogger(__name__)


@app.exception_handler(HTTPException)
async def http_exc(request: Request, exc: HTTPException):
    print("HHTP_EXC", exc)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exc(request: Request, exc: RequestValidationError):
    print("VALIDATATION_EXC", exc)
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def global_exc(request: Request, exc: Exception):
    print("GLOABL_EXC", exc)
    log.exception("Unhandled error at %s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})


# ─── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include routers ─────────────────────────────────────────────
for r in all_apis:
    app.include_router(r)
