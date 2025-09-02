from fastapi import APIRouter, Depends
from app.services.ai_handler import generate_lesson_service, update_lesson_service
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session

from app.api.deps import get_current_admin
from app.core.config import settings


router = APIRouter(prefix="/ai_handler", tags=["AI HANDLER"])


@router.post("/update_lesson", dependencies=[Depends(get_current_admin)])
async def generate_and_update_lesson(
    course_uid: UUID,
    lesson_id: int,
    gemini_key: str,
    gemini_model: str = settings.GEMINI_MODEL or "",
    max_tokens: int = 2000,
    db: AsyncSession = Depends(get_async_session),
):
    try:
        if not course_uid:
            raise ValueError("course_uid is expected!")
        if not lesson_id:
            raise ValueError("lesson_id is expected!")
        result = await generate_lesson_service(
            db, course_uid, lesson_id, gemini_model, gemini_key, max_tokens
        )
        if result and result.get("text"):
            output = await update_lesson_service(lesson_id, result.get("text"), db)
            return {
                "title": output.title,
                "section_id": output.section_id,
                "input_tokens": result.get("input_tokens"),
                "usage_metadata": result.get("usage_metadata"),
                "content": output.content,
                "id": output.id,
                "lesson_order": output.lesson_order,
            }
        else:
            raise ValueError("AI GNERATION ERROR!")
    except Exception as e:
        return e
