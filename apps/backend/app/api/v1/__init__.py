from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.courses import router as course_router
from app.api.v1.sections import router as section_router
from app.api.v1.lessons import router as lesson_router
from app.api.v1.projects import router as project_router
from app.api.v1.users import router as user_router
from app.api.v1.media import router as media_router
from app.api.v1.ai_handler import router as AI_HANDLE_ROUTER
from app.api.v1.profile import router as profile_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(course_router)
api_router.include_router(section_router)
api_router.include_router(lesson_router)
api_router.include_router(project_router)
api_router.include_router(user_router)
api_router.include_router(AI_HANDLE_ROUTER)
api_router.include_router(media_router)
api_router.include_router(profile_router)
