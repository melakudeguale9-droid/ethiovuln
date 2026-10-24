"""
EthioVuln — AI / Gemini Schemas
"""

from typing import Optional, List, Literal
from pydantic import BaseModel, Field


class GeminiPingResponse(BaseModel):
    success: bool
    configured: bool
    message: str
    model: str
    latency_ms: float


class GeminiGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=4000, description="User prompt or security inquiry")
    system_instruction: Optional[str] = Field(None, max_length=1000, description="Optional custom system role")
    context: Optional[str] = Field(None, max_length=4000, description="Optional vulnerability or scan finding context")


class GeminiGenerateResponse(BaseModel):
    success: bool
    configured: bool
    response: str
    model: str
    latency_ms: float


class GeminiStatusResponse(BaseModel):
    configured: bool
    model: str


# ─── Chat Assistant Schemas ───────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "model", "assistant"] = Field(..., description="Message author role")
    content: str = Field(..., min_length=1, max_length=8000, description="Message content text")


class GeminiChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_length=1, description="Conversation history including latest query")
    context: Optional[str] = Field(None, max_length=4000, description="Optional target scope or scan telemetry context")
    system_instruction: Optional[str] = Field(None, max_length=1500, description="Optional system instruction override")


class GeminiChatResponse(BaseModel):
    success: bool
    configured: bool
    role: str = "model"
    response: str
    model: str
    latency_ms: float


# ─── Vulnerability Mitigation Schemas ─────────────────────────────────

class GeminiMitigateRequest(BaseModel):
    vulnerability_title: str = Field(..., description="Vulnerability title or headline")
    description: str = Field(..., description="Vulnerability description or finding details")
    cwe_id: Optional[str] = Field(None, description="CWE identifier, e.g. CWE-89")
    target_technology: Optional[str] = Field(None, description="Backend framework or language")
    vulnerable_code: Optional[str] = Field(None, description="Optional code snippet requiring remediation")


class GeminiMitigateResponse(BaseModel):
    success: bool
    configured: bool
    mitigation_steps: str
    remediation_patch: Optional[str] = None
    model: str
    latency_ms: float

