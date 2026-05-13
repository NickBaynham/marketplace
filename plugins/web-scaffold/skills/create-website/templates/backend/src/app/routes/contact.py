import logging

import httpx
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.settings import settings

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class ContactPayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)
    # Honeypot: real users leave this blank. Bots that fill every field will trip it.
    website: str = Field(default="", max_length=0)


@router.post("/contact", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit(settings.contact_rate_limit)
async def submit_contact(request: Request, payload: ContactPayload) -> dict[str, str]:
    if settings.resend_api_key and settings.resend_from_email:
        await _send_via_resend(payload)
    else:
        logger.info("contact form submission: %s <%s>", payload.name, payload.email)
    return {"status": "accepted"}


async def _send_via_resend(payload: ContactPayload) -> None:
    body = {
        "from": settings.resend_from_email,
        "to": [settings.contact_inbox_email],
        "subject": f"Website contact from {payload.name}",
        "reply_to": payload.email,
        "text": f"From: {payload.name} <{payload.email}>\n\n{payload.message}",
    }
    headers = {"Authorization": f"Bearer {settings.resend_api_key}"}
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post("https://api.resend.com/emails", json=body, headers=headers)
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="Email provider rejected message")
