# gemini_service.py
from app.core.config import settings
from http_client import http_post_json


def build_gemini_payload(user_text: str, temperature: float, max_tokens: int):
    return {
        "contents": [{"role": "user", "parts": [{"text": user_text}]}],
        "generationConfig": {"temperature": temperature, "maxOutputTokens": max_tokens},
    }


def extract_first_candidate_text(data: dict) -> str:
    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError("No candidates returned by Gemini.")

    parts = candidates[0].get("content", {}).get("parts", [])
    if not parts:
        raise ValueError("Gemini response missing 'parts'.")

    for part in parts:
        if "text" in part:
            return part["text"]
    raise ValueError("Gemini response parts missing 'text' field.")


def call_gemini(prompt_text: str, temperature: float, max_tokens: int) -> str:
    if not settings.GEMINI_ENDPOINT_TEMPLATE:
        raise ValueError("GEMIN API IS NOT PASSED!")
    url = settings.GEMINI_ENDPOINT_TEMPLATE
    payload = build_gemini_payload(prompt_text, temperature, max_tokens)
    data = http_post_json(url, payload)
    return extract_first_candidate_text(data)
