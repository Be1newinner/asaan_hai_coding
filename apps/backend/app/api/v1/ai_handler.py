from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_handler import generate_lesson_service, update_lesson_service
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.services.lesson import lesson_crud
from app.schemas.lesson import LessonUpdate
from app.api.deps import get_current_admin

router = APIRouter(prefix="/ai_handler", tags=["AI HANDLER"])


@router.post("/update_lesson", dependencies=[Depends(get_current_admin)])
async def generate_and_update_lesson(
    course_uid: UUID, lesson_id: int, db: AsyncSession = Depends(get_async_session)
):
    try:
        if not course_uid:
            raise ValueError("course_uid is expected!")
        if not lesson_id:
            raise ValueError("lesson_id is expected!")
        result = await generate_lesson_service(course_uid, lesson_id, db)
        if result:
            return await update_lesson_service(lesson_id, result, db)
        else:
            raise ValueError("AI GNERATION ERROR!")
    except Exception as e:
        print(e)
        return {"description": "Unknown Error!"}
