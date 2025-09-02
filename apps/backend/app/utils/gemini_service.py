# app/utils/gemini_service.py
from google import genai
from google.genai import types
import asyncio
import time
import threading
import json


class _ClientCache:
    def __init__(self, maxsize: int = 128, ttl_seconds: int = 3600):
        self._maxsize = maxsize
        self._ttl = ttl_seconds
        self._lock = threading.Lock()
        self._data = {}
        self._order = []

    def _evict_expired(self, now: float):
        expired = [k for k, (_, ts) in self._data.items() if now - ts > self._ttl]
        for k in expired:
            self._data.pop(k, None)
            try:
                self._order.remove(k)
            except ValueError:
                pass

    def _evict_lru_if_needed(self):
        while len(self._data) > self._maxsize:
            k = self._order.pop(0)
            self._data.pop(k, None)

    def get(self, key: tuple[str, str]):
        now = time.time()
        with self._lock:
            self._evict_expired(now)
            item = self._data.get(key)
            if not item:
                return None
            client, _ = item
            try:
                self._order.remove(key)
            except ValueError:
                pass
            self._order.append(key)
            self._data[key] = (client, now)
            return client

    def set(self, key: tuple[str, str], client):
        now = time.time()
        with self._lock:
            if key in self._data:
                try:
                    self._order.remove(key)
                except ValueError:
                    pass
            self._data[key] = (client, now)
            self._order.append(key)
            self._evict_lru_if_needed()


_client_cache = _ClientCache(maxsize=128, ttl_seconds=1800)


def _get_client(gemini_key: str, gemini_model: str) -> genai.Client:
    cache_key = (gemini_key, gemini_model)
    client = _client_cache.get(cache_key)
    if client is not None:
        return client
    client = genai.Client(api_key=gemini_key)
    _client_cache.set(cache_key, client)
    return client


async def call_gemini(
    prompt_text: str,
    max_tokens: int,
    gemini_model: str,
    gemini_key: str,
):
    THINKING_BUDGET = 3500

    output = {}
    client = _get_client(gemini_key, gemini_model)
    count = client.models.count_tokens(model=gemini_model, contents=prompt_text)
    output["input_tokens"] = count.total_tokens
    cfg = types.GenerateContentConfig(
        response_mime_type="text/plain",
        max_output_tokens=max_tokens + THINKING_BUDGET + (count.total_tokens or 0),
    )

    if hasattr(client, "aio") and hasattr(client.aio, "models"):
        resp = await client.aio.models.generate_content(
            model=gemini_model, contents=prompt_text, config=cfg
        )
        output["usage_metadata"] = resp.usage_metadata
        output["text"] = (resp.text or "").strip()
        return output

    resp = await asyncio.to_thread(
        client.models.generate_content,
        model=gemini_model,
        contents=prompt_text,
        config=cfg,
    )

    output["usage_metadata"] = resp.usage_metadata
    output["text"] = (resp.text or "").strip()
    return output


def extract_output_as_json(api_output_string):
    try:
        print(api_output_string)
        parsed_data = json.loads(api_output_string)
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except (IndexError, TypeError) as e:
        print(f"Error accessing data from parsed JSON: {e}")
