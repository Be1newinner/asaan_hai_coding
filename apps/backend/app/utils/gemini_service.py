# gemini_service.py
from app.core.config import settings
from google import genai
from google.genai import types
import asyncio
import json

client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
)


async def call_gemini(prompt_text: str, max_tokens: int) -> str:
    cfg = types.GenerateContentConfig(
        response_mime_type="text/plain",
        max_output_tokens=max_tokens,
    )

    if hasattr(client, "aio") and hasattr(client.aio, "models"):
        resp = await client.aio.models.generate_content(
            model=getattr(settings, "GEMINI_MODEL", None) or "gemini-2.5-flash",
            contents=prompt_text,
            config=cfg,
        )
        return (resp.text or "").strip()

    resp = await asyncio.to_thread(
        client.models.generate_content,
        model=getattr(settings, "GEMINI_MODEL", None) or "gemini-2.5-flash",
        contents=prompt_text,
        config=cfg,
    )
    return (resp.text or "").strip()


def extract_output_as_json(api_output_string):
    try:
        print(api_output_string)
        parsed_data = json.loads(api_output_string)
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except (IndexError, TypeError) as e:
        print(f"Error accessing data from parsed JSON: {e}")
