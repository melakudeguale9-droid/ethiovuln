"""
EthioVuln — Google GenAI (Gemini) Service
Uses the official google-genai SDK (`from google import genai`) with non-blocking execution,
strict 15-second timeouts, graceful missing key handling, and mitigation processing.
"""

import asyncio
import time
import os
import logging
from typing import Optional, Dict, Any, List
from app.config import get_settings

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.settings = get_settings()

    def _get_api_key(self) -> str:
        """Retrieves the Gemini API key from environment variables or settings."""
        key = (
            os.environ.get("GEMINI_API_KEY")
            or os.environ.get("GOOGLE_API_KEY")
            or getattr(self.settings, "GEMINI_API_KEY", "")
            or ""
        )
        return key.strip()

    def get_model(self) -> str:
        """
        Retrieves the active Gemini model name (defaults to gemini-2.5-flash).
        """
        env_model = os.environ.get("GEMINI_MODEL", "").strip()
        if env_model:
            return env_model
        try:
            model = getattr(self.settings, "GEMINI_MODEL", "").strip()
            if model:
                return model
        except Exception:
            pass
        return "gemini-2.5-flash"

    def is_configured(self) -> bool:
        """Checks if a valid Gemini API key is provided."""
        return bool(self._get_api_key())

    def _get_client(self):
        """Initializes and returns the official Google GenAI Client."""
        api_key = self._get_api_key()
        if not api_key:
            return None
        try:
            from google import genai
            return genai.Client(api_key=api_key)
        except ImportError:
            logger.error("google-genai package is not installed. Run: pip install google-genai")
            return None

    async def _safe_generate_content(
        self,
        client: Any,
        model_name: str,
        contents: Any,
        config: Any = None,
        timeout_seconds: float = 15.0,
    ) -> Any:
        """
        Safely calls client.models.generate_content in a non-blocking thread
        with a strict timeout (defaults to 15 seconds).
        """
        def _invoke():
            if config is not None:
                return client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config,
                )
            return client.models.generate_content(
                model=model_name,
                contents=contents,
            )

        return await asyncio.wait_for(
            asyncio.to_thread(_invoke),
            timeout=timeout_seconds,
        )

    async def ping(self) -> Dict[str, Any]:
        """
        Sends a lightweight probe to verify connectivity, measure latency,
        and validate model response within a strict 15s timeout.
        """
        model_name = self.get_model()

        if not self.is_configured():
            return {
                "success": False,
                "configured": False,
                "message": "Gemini API key is not configured in backend/.env (set GEMINI_API_KEY=...).",
                "model": model_name,
                "latency_ms": 0.0,
            }

        client = self._get_client()
        if not client:
            return {
                "success": False,
                "configured": False,
                "message": "Google GenAI client could not be initialized.",
                "model": model_name,
                "latency_ms": 0.0,
            }

        start_time = time.perf_counter()
        try:
            prompt = "Ping verification test: Reply with 'PONG: EthioVuln Gemini AI connection verified successfully.' and 1 short status sentence."
            try:
                response = await self._safe_generate_content(
                    client=client,
                    model_name=model_name,
                    contents=prompt,
                    timeout_seconds=15.0,
                )
            except (asyncio.TimeoutError, TimeoutError):
                latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "success": False,
                    "configured": True,
                    "message": "Gemini API ping timed out after 15 seconds.",
                    "model": model_name,
                    "latency_ms": latency_ms,
                }
            except Exception as e:
                err_str = str(e)
                if ("NOT_FOUND" in err_str or "no longer available" in err_str or "503" in err_str) and model_name != "gemini-3.5-flash-lite":
                    fallback_model = "gemini-3.5-flash-lite"
                    logger.warning(f"Model {model_name} issue; auto-retrying ping with fallback {fallback_model}")
                    response = await self._safe_generate_content(
                        client=client,
                        model_name=fallback_model,
                        contents=prompt,
                        timeout_seconds=15.0,
                    )
                    model_name = fallback_model
                else:
                    raise

            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            response_text = response.text.strip() if hasattr(response, "text") and response.text else "PONG: Connection verified."

            return {
                "success": True,
                "configured": True,
                "message": response_text,
                "model": model_name,
                "latency_ms": latency_ms,
            }
        except Exception as e:
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(f"Gemini API Ping failed: {e}")
            return {
                "success": False,
                "configured": True,
                "message": f"Gemini API error: {str(e)}",
                "model": model_name,
                "latency_ms": latency_ms,
            }

    async def generate_response(
        self, prompt: str, system_instruction: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates security remediation advice, vulnerability analysis,
        or cyber security guidance using Gemini in a non-blocking thread with 15s timeout.
        """
        model_name = self.get_model()

        if not self.is_configured():
            return {
                "success": False,
                "configured": False,
                "response": "Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env to enable AI vulnerability analysis.",
                "model": model_name,
                "latency_ms": 0.0,
            }

        client = self._get_client()
        if not client:
            return {
                "success": False,
                "configured": False,
                "response": "Google GenAI client could not be initialized.",
                "model": model_name,
                "latency_ms": 0.0,
            }

        start_time = time.perf_counter()
        try:
            from google.genai import types

            default_system = (
                "You are EthioVuln Security Intelligence AI, an expert cyber security advisor "
                "specializing in web application penetration testing, OWASP Top 10 vulnerabilities, "
                "CWE/CVSS classification, and secure code remediation. Provide accurate, professional, "
                "actionable, and structured answers."
            )

            config = types.GenerateContentConfig(
                system_instruction=system_instruction or default_system,
                temperature=0.3,
            )

            try:
                response = await self._safe_generate_content(
                    client=client,
                    model_name=model_name,
                    contents=prompt,
                    config=config,
                    timeout_seconds=15.0,
                )
            except (asyncio.TimeoutError, TimeoutError):
                latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "success": False,
                    "configured": True,
                    "response": "Gemini API request timed out after 15 seconds. Please try again.",
                    "model": model_name,
                    "latency_ms": latency_ms,
                }
            except Exception as e:
                err_str = str(e)
                if ("NOT_FOUND" in err_str or "no longer available" in err_str or "503" in err_str) and model_name != "gemini-3.5-flash-lite":
                    fallback_model = "gemini-3.5-flash-lite"
                    logger.warning(f"Model {model_name} issue; auto-retrying generation with {fallback_model}")
                    response = await self._safe_generate_content(
                        client=client,
                        model_name=fallback_model,
                        contents=prompt,
                        config=config,
                        timeout_seconds=15.0,
                    )
                    model_name = fallback_model
                else:
                    raise

            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            reply_text = response.text.strip() if hasattr(response, "text") and response.text else "No response generated."

            return {
                "success": True,
                "configured": True,
                "response": reply_text,
                "model": model_name,
                "latency_ms": latency_ms,
            }
        except Exception as e:
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(f"Gemini generation error: {e}")
            return {
                "success": False,
                "configured": True,
                "response": f"Gemini API generation error: {str(e)}",
                "model": model_name,
                "latency_ms": latency_ms,
            }

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: Optional[str] = None,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes a multi-turn conversation with Gemini AI for interactive cybersecurity guidance,
        code remediation, or platform scan analysis.
        """
        model_name = self.get_model()

        if not self.is_configured():
            return {
                "success": False,
                "configured": False,
                "role": "model",
                "response": "Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env to activate the AI Cyber Assistant.",
                "model": model_name,
                "latency_ms": 0.0,
            }

        client = self._get_client()
        if not client:
            return {
                "success": False,
                "configured": False,
                "role": "model",
                "response": "Google GenAI client could not be initialized.",
                "model": model_name,
                "latency_ms": 0.0,
            }

        start_time = time.perf_counter()
        try:
            from google.genai import types

            default_system = (
                "You are EthioVuln Cyber Security AI Assistant, an elite application security "
                "and vulnerability remediation expert. You assist developers, penetration testers, "
                "and security analysts. Help them analyze vulnerabilities (OWASP Top 10, CWE, CVE), "
                "remediate security flaws in their code (Python, JavaScript/TypeScript, Go, SQL, Bash), "
                "configure secure headers, harden servers, and interpret scan reports. "
                "Format your responses cleanly with markdown, including syntax-highlighted code blocks, "
                "concise bullet points, and actionable security recommendations. Be clear, precise, and supportive."
            )

            config = types.GenerateContentConfig(
                system_instruction=system_instruction or default_system,
                temperature=0.3,
            )

            contents = []
            for i, msg in enumerate(messages):
                raw_role = msg.get("role", "user")
                role = "model" if raw_role in ("model", "assistant") else "user"
                content_text = msg.get("content", "").strip()

                if context and i == len(messages) - 1 and role == "user":
                    content_text = f"Context (Scan or Finding):\n{context}\n\nUser Question:\n{content_text}"

                if content_text:
                    contents.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=content_text)],
                        )
                    )

            if not contents:
                contents = ["Hello! How can you help me secure my web application?"]

            try:
                response = await self._safe_generate_content(
                    client=client,
                    model_name=model_name,
                    contents=contents,
                    config=config,
                    timeout_seconds=15.0,
                )
            except (asyncio.TimeoutError, TimeoutError):
                latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
                return {
                    "success": False,
                    "configured": True,
                    "role": "model",
                    "response": "Gemini AI assistant timed out after 15 seconds. Please try asking again.",
                    "model": model_name,
                    "latency_ms": latency_ms,
                }
            except Exception as e:
                err_str = str(e)
                if ("NOT_FOUND" in err_str or "no longer available" in err_str or "503" in err_str) and model_name != "gemini-3.5-flash-lite":
                    fallback_model = "gemini-3.5-flash-lite"
                    logger.warning(f"Model {model_name} issue; auto-retrying chat with {fallback_model}")
                    response = await self._safe_generate_content(
                        client=client,
                        model_name=fallback_model,
                        contents=contents,
                        config=config,
                        timeout_seconds=15.0,
                    )
                    model_name = fallback_model
                else:
                    raise

            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            reply_text = response.text.strip() if hasattr(response, "text") and response.text else "No response generated."

            return {
                "success": True,
                "configured": True,
                "role": "model",
                "response": reply_text,
                "model": model_name,
                "latency_ms": latency_ms,
            }
        except Exception as e:
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(f"Gemini chat error: {e}")
            return {
                "success": False,
                "configured": True,
                "role": "model",
                "response": f"Gemini Assistant error: {str(e)}",
                "model": model_name,
                "latency_ms": latency_ms,
            }

    async def generate_mitigation_patch(
        self,
        vulnerability_title: str,
        description: str,
        cwe_id: Optional[str] = None,
        target_technology: Optional[str] = None,
        vulnerable_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generates structured mitigation steps and code remediation patch safely without blocking.
        """
        model_name = self.get_model()

        if not self.is_configured():
            return {
                "success": False,
                "configured": False,
                "mitigation_steps": "Gemini API key is not configured. Configure GEMINI_API_KEY in backend/.env for automated mitigation patches.",
                "remediation_patch": None,
                "model": model_name,
                "latency_ms": 0.0,
            }

        client = self._get_client()
        if not client:
            return {
                "success": False,
                "configured": False,
                "mitigation_steps": "Google GenAI client could not be initialized.",
                "remediation_patch": None,
                "model": model_name,
                "latency_ms": 0.0,
            }

        start_time = time.perf_counter()
        prompt = (
            f"Vulnerability: {vulnerability_title}\n"
            f"Description: {description}\n"
            f"CWE: {cwe_id or 'N/A'}\n"
            f"Technology: {target_technology or 'Web Application'}\n"
        )
        if vulnerable_code:
            prompt += f"\nVulnerable Code Snippet:\n```\n{vulnerable_code}\n```"

        prompt += (
            "\n\nPlease provide:\n"
            "1. Concise, actionable mitigation steps (bullet points).\n"
            "2. A secure remediation code patch (in a markdown code block)."
        )

        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                system_instruction="You are EthioVuln Security Intelligence AI. Provide direct, highly secure code remediation patches.",
                temperature=0.2,
            )
            response = await self._safe_generate_content(
                client=client,
                model_name=model_name,
                contents=prompt,
                config=config,
                timeout_seconds=15.0,
            )
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            content = response.text.strip() if hasattr(response, "text") and response.text else ""

            # Extract code block if present
            patch = None
            if "```" in content:
                parts = content.split("```")
                if len(parts) >= 3:
                    patch = parts[1].strip()

            return {
                "success": True,
                "configured": True,
                "mitigation_steps": content,
                "remediation_patch": patch,
                "model": model_name,
                "latency_ms": latency_ms,
            }
        except Exception as e:
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(f"Gemini mitigation patch generation failed: {e}")
            return {
                "success": False,
                "configured": True,
                "mitigation_steps": f"Failed to generate mitigation patch: {str(e)}",
                "remediation_patch": None,
                "model": model_name,
                "latency_ms": latency_ms,
            }


gemini_service = GeminiService()
