# app/core/errors.py
from fastapi import HTTPException, status
import uuid
import logging

log = logging.getLogger("api")


class SafeAPIError(HTTPException):
    def __init__(
        self, status_code: int, error_code: str, detail: str, correlation_id: str
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "error_code": error_code,
                "detail": detail,
                "correlation_id": correlation_id,
            },
        )


def map_upstream_gemini_error(upstream: dict) -> SafeAPIError:
    """
    upstream is the parsed error response from the external API.
    DO NOT return upstream content to clients; only log it.
    """
    corr = str(uuid.uuid4())
    log.warning("Upstream Gemini error corr=%s payload=%s", corr, upstream)

    status_code = status.HTTP_400_BAD_REQUEST
    error_code = "EXTERNAL_REQUEST_FAILED"
    detail = "External service returned an error."

    try:
        info = upstream.get("details", {}).get("error", {}) or {}
        msg = (info.get("message") or "").lower()
        reason = ""
        for d in info.get("details", []):
            if d.get("@type", "").endswith("ErrorInfo"):
                reason = d.get("reason", "") or ""
                break

        if "api key" in msg or reason in {"API_KEY_INVALID", "API_KEY_EXPIRED"}:
            status_code = status.HTTP_401_UNAUTHORIZED
            error_code = "EXTERNAL_API_KEY_EXPIRED"
            detail = "The provided API key is invalid or expired."
        elif "quota" in msg or "rate" in msg:
            status_code = status.HTTP_429_TOO_MANY_REQUESTS
            error_code = "EXTERNAL_RATE_LIMIT"
            detail = "External service rate limit exceeded. Try again later."
        elif "permission" in msg or "unauthorized" in msg:
            status_code = status.HTTP_403_FORBIDDEN
            error_code = "EXTERNAL_NOT_ALLOWED"
            detail = "Not authorized to perform this operation on external service."
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            error_code = "EXTERNAL_INVALID_ARGUMENT"
            detail = "Invalid request to the external service."
    except Exception:
        status_code = status.HTTP_502_BAD_GATEWAY
        error_code = "EXTERNAL_ERROR"
        detail = "External service error."

    return SafeAPIError(status_code, error_code, detail, corr)
