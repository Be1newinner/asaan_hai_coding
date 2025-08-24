from app.utils.gemini_service import call_gemini, extract_output_as_json

# from app.utils.course_data import course_dic
from app.utils.prompts import course_prompt
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.lesson import lesson_crud
from fastapi import HTTPException
from app.services.course import course_crud
from app.schemas.lesson import LessonUpdate

max_tokens = 3000


async def generate_lesson_service(
    course_id: UUID, lesson_id: int, db: AsyncSession
):
    try:
        course_detailed = await course_crud.getDetailed(db, course_id)
        if not course_detailed:
            return None
        course_as_dict = course_detailed.__dict__
        AI_PROMPT = course_prompt(course_as_dict, lesson_id)
        print(AI_PROMPT)
        response = await call_gemini(AI_PROMPT, max_tokens)
        return response
    except Exception as e:
        print(e)
        return None


async def update_lesson_service(lesson_id: int, course_content, db: AsyncSession):
    lesson = await lesson_crud.get(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    update_data = {"content": course_content}
    lesson_update = LessonUpdate(**update_data)
    return await lesson_crud.update(db, lesson, lesson_update)
