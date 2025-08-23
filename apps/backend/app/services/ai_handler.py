from app.utils.gemini_service import call_gemini
from app.utils.output_format import extract_output_as_json

# from app.utils.course_data import course_dic
from app.utils.prompts import course_prompt
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.course import course_crud

temperature, max_tokens = 0.2, 3000


async def generate_lesson_service(
    course_id: UUID, lesson_id: int, db: AsyncSession
) -> dict | list | None:
    try:
        course_detailed = await course_crud.getDetailed(db, course_id)
        if not course_detailed:
            return None
        course_as_dict = course_detailed.__dict__
        print(course_as_dict)
        AI_PROMPT = course_prompt(course_as_dict, lesson_id)
        response_text = call_gemini(AI_PROMPT, temperature, max_tokens)
        return extract_output_as_json(response_text[8:-3])
    except Exception as e:
        print(e)
        return None
