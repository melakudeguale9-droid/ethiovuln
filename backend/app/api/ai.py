"""
EthioVuln — AI & Gemini Router
Secure endpoints for Google GenAI integration, latency probing, and vulnerability intelligence.
Strictly rate limited to prevent API cost abuse.
"""

import logging
from fastapi import APIRouter, Depends, Request, HTTPException, status
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.services.gemini_service import gemini_service
from app.core.rate_limit import limiter, RATE_LIMIT_AI_PROBE, RATE_LIMIT_GENERAL
from app.schemas.ai import (
    GeminiPingResponse,
    GeminiGenerateRequest,
    GeminiGenerateResponse,
    GeminiStatusResponse,
    GeminiChatRequest,
    GeminiChatResponse,
    GeminiMitigateRequest,
    GeminiMitigateResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(tags=["AI Intelligence (Gemini)"])


@router.get("/status", response_model=GeminiStatusResponse)
@limiter.limit(RATE_LIMIT_GENERAL)
async def get_ai_status(
    request: Request,
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Check if Google GenAI (Gemini) is configured with an active API key.
    """
    return GeminiStatusResponse(
        configured=gemini_service.is_configured(),
        model=gemini_service.get_model(),
    )


@router.post("/ping", response_model=GeminiPingResponse)
@limiter.limit(RATE_LIMIT_AI_PROBE)
async def ping_gemini(
    request: Request,
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Endpoint that pings the Google GenAI (Gemini) API,
    verifies live connectivity, measures roundtrip latency, and returns model response.
    Strictly rate limited (5 requests/minute) to prevent API cost abuse.
    """
    user_str = current_user.username if current_user else "anonymous"
    logger.info(f"User '{user_str}' initiated Gemini API ping probe.")
    result = await gemini_service.ping()
    return GeminiPingResponse(**result)


@router.post("/generate", response_model=GeminiGenerateResponse)
@limiter.limit(RATE_LIMIT_GENERAL)
async def generate_gemini(
    payload: GeminiGenerateRequest,
    request: Request,
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Endpoint to prompt Gemini for cyber security analysis,
    OWASP vulnerability explanation, remediation guidance, or custom queries.
    """
    user_str = current_user.username if current_user else "anonymous"
    logger.info(f"User '{user_str}' sent prompt to Gemini model.")

    prompt_text = payload.prompt
    if payload.context:
        prompt_text = f"Context finding:\n{payload.context}\n\nUser Question:\n{payload.prompt}"

    result = await gemini_service.generate_response(
        prompt=prompt_text,
        system_instruction=payload.system_instruction,
    )
    return GeminiGenerateResponse(**result)


@router.post("/chat", response_model=GeminiChatResponse)
@limiter.limit(RATE_LIMIT_GENERAL)
async def chat_gemini(
    payload: GeminiChatRequest,
    request: Request,
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Endpoint for interactive multi-turn cyber security AI Chat Assistant.
    """
    user_str = current_user.username if current_user else "anonymous"
    logger.info(f"User '{user_str}' sending conversation turn to Gemini AI assistant.")
    result = await gemini_service.chat(
        messages=[m.model_dump() for m in payload.messages],
        system_instruction=payload.system_instruction,
        context=payload.context,
    )
    return GeminiChatResponse(**result)


@router.post("/mitigate", response_model=GeminiMitigateResponse)
@limiter.limit(RATE_LIMIT_GENERAL)
async def mitigate_vulnerability(
    payload: GeminiMitigateRequest,
    request: Request,
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Generate an actionable security mitigation and code remediation patch for a detected vulnerability.
    """
    user_str = current_user.username if current_user else "anonymous"
    logger.info(f"User '{user_str}' requested mitigation patch for '{payload.vulnerability_title}'.")
    result = await gemini_service.generate_mitigation_patch(
        vulnerability_title=payload.vulnerability_title,
        description=payload.description,
        cwe_id=payload.cwe_id,
        target_technology=payload.target_technology,
        vulnerable_code=payload.vulnerable_code,
    )
    return GeminiMitigateResponse(**result)
