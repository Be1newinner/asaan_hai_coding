from fastapi import APIRouter, Depends
from app.services.ai_handler import generate_lesson_service
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session

router = APIRouter(prefix="/ai_handler", tags=["AI HANDLER"])


@router.post("/generate_lesson")
async def generate_lesson(
    course_uid: UUID, lesson_id: int, db: AsyncSession = Depends(get_async_session)
):
    try:
        if not course_uid:
            raise ValueError("course_uid is expected!")
        if not lesson_id:
            raise ValueError("lesson_id is expected!")
        result = await generate_lesson_service(course_uid, lesson_id, db)
        if result:
            return result
        else:
            raise ValueError("Unknown Error Occured!")
    except Exception as e:
        print(e)
        return {"description": "Unknown Error!"}
