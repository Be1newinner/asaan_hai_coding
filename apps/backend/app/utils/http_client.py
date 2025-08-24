# http_client.py
import json
import requests
import httpx


def http_get_json(url: str, timeout: int = 30):
    resp = requests.get(url, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def http_post_json(url: str, payload: dict, timeout: int = 60):
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
    try:
        resp.raise_for_status()
    except requests.HTTPError as ex:
        print("Status code:", resp.status_code)
        try:
            print("Response:", json.dumps(resp.json(), indent=2))
        except Exception:
            print("Response text:", resp.text[:500])
        raise
    return resp.json()


async def http_post_json_async(url: str, payload: dict, timeout: int = 60):
    headers = {"Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, headers=headers, json=payload)
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as ex:
            print("status code: ", resp.status_code)
            try:
                print("Response: ", json.dumps(resp.json(), indent=2))
            except Exception:
                print(print("Response text:", resp.text[:500]))
            raise
        return resp.json()
