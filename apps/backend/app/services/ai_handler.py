from app.utils.gemini_service import call_gemini

from app.utils.prompts import course_prompt
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.lesson import lesson_crud
from fastapi import HTTPException
from app.services.course import course_crud
from app.schemas.lesson import LessonUpdate
import httpx
from app.core.errors import map_upstream_gemini_error, SafeAPIError


async def generate_lesson_service(
    db: AsyncSession,
    course_id: UUID,
    lesson_id: int,
    gemini_model: str,
    gemini_key: str,
    max_tokens: int,
):
    try:
        course = await course_crud.getDetailed(db, course_id)
        if not course:
            return None
        AI_PROMPT = course_prompt(course.__dict__, lesson_id, max_token=max_tokens)
        resp = await call_gemini(AI_PROMPT, max_tokens, gemini_model, gemini_key)
        return resp

    except httpx.HTTPStatusError as e:
        upstream = {"details": safe_json(e.response)}
        raise map_upstream_gemini_error(upstream)

    except httpx.RequestError as e:
        upstream = {"details": {"error": {"message": str(e)}}}
        raise map_upstream_gemini_error(upstream)

    except ValueError as e:
        upstream = {"details": {"error": {"message": str(e)}}}
        raise map_upstream_gemini_error(upstream)

    except Exception as e:
        upstream = {"details": {"error": {"message": "Internal error"}}}

        if str(e).find("API_KEY_INVALID"):
            upstream = {"details": {"error": {"message": "Invalid API Key"}}}

        raise map_upstream_gemini_error(upstream)


def safe_json(response: httpx.Response) -> dict:
    try:
        return response.json()
    except Exception:
        return {"status_code": response.status_code, "text": response.text[:512]}


async def update_lesson_service(lesson_id: int, course_content, db: AsyncSession):
    lesson = await lesson_crud.get(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    update_data = {"content": course_content}
    lesson_update = LessonUpdate(**update_data)
    return await lesson_crud.update(db, lesson, lesson_update)
