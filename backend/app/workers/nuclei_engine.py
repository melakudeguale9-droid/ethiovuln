"""
EthioVuln — Nuclei Scan Engine
Wraps ProjectDiscovery Nuclei via subprocess for template-based vulnerability detection.
"""

import json
import subprocess
import logging
from typing import Generator
from app.config import get_settings
from app.utils.cvss import nuclei_severity_to_cvss
from app.utils.cwe_mapping import get_cwe_info

settings = get_settings()
logger = logging.getLogger(__name__)


class NucleiEngine:
    """
    Executes Nuclei scans via subprocess with JSONL output parsing.
    Streams results line-by-line for real-time processing.
    """

    def __init__(self, nuclei_path: str | None = None):
        self.nuclei_path = nuclei_path or settings.NUCLEI_PATH

    def build_command(self, target: str, templates: list[str] | None = None) -> list[str]:
        """Build the Nuclei command as a safe argument list (no shell injection)."""
        cmd = [
            self.nuclei_path,
            "-target", target,
            "-jsonl",
            "-rate-limit", "150",
            "-bulk-size", "50",
            "-concurrency", "25",
            "-timeout", "8",
            "-retries", "1",
            "-no-color",
            "-timestamp",
            "-duc",
            "-nmhe",
            # Only run fast, high-value tag categories — completes in ~30-45s
            "-tags", "tech,ssl,misconfig,exposure,headers,cors,xss,sqli,lfi,rce,cve",
            # Exclude slow/noisy categories
            "-exclude-tags", "dos,fuzz,headless,fuzzing",
        ]

        if templates:
            # If caller specifies templates, drop the tag filters
            cmd = [c for c in cmd if c not in (
                "-tags", "tech,ssl,misconfig,exposure,headers,cors,xss,sqli,lfi,rce,cve",
                "-exclude-tags", "dos,fuzz,headless,fuzzing",
            )]
            for template in templates:
                cmd.extend(["-t", template])

        return cmd

    def run_scan(self, target: str, templates: list[str] | None = None,
                 timeout: int = 600) -> list[dict]:
        """
        Execute a full Nuclei scan and return parsed findings.
        
        Args:
            target: URL to scan
            templates: Optional list of template paths/IDs
            timeout: Maximum scan duration in seconds
            
        Returns:
            List of normalized vulnerability dictionaries
        """
        cmd = self.build_command(target, templates)
        findings = []

        try:
            logger.info(f"Starting Nuclei scan: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=timeout,
                shell=False,  # Security: never use shell=True
            )

            for line in result.stdout.strip().split("\n"):
                if not line.strip() or line.strip().startswith("["):
                    continue
                try:
                    finding = json.loads(line)
                    normalized = self._normalize_finding(finding, target)
                    if normalized:
                        findings.append(normalized)
                except json.JSONDecodeError:
                    logger.debug(f"Skipping non-JSON Nuclei output: {line[:100]}")

            if result.returncode != 0 and result.stderr:
                logger.warning(f"Nuclei stderr: {result.stderr[:500]}")

        except subprocess.TimeoutExpired:
            logger.error(f"Nuclei scan timed out after {timeout}s for {target}")
        except FileNotFoundError:
            logger.error(
                f"Nuclei binary not found at '{self.nuclei_path}'. "
                f"Install from https://github.com/projectdiscovery/nuclei"
            )
        except Exception as e:
            logger.error(f"Nuclei scan error: {str(e)}")

        return findings

    def stream_scan(self, target: str, templates: list[str] | None = None,
                    timeout: int = 50) -> Generator[dict, None, None]:
        """
        Execute Nuclei scan and yield findings as they arrive (streaming).
        Hard timeout of 50s so the full scan stays under 1 minute.
        """
        cmd = self.build_command(target, templates)
        logger.info(f"Nuclei stream_scan command: {' '.join(cmd)}")

        import threading

        try:
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=False,
            )

            # Kill process after hard timeout
            def _kill():
                try:
                    process.kill()
                    logger.info("Nuclei process killed after timeout")
                except Exception:
                    pass

            timer = threading.Timer(timeout, _kill)
            timer.start()

            try:
                for line in iter(process.stdout.readline, ""):
                    line = line.strip()
                    if not line or line.startswith("["):
                        continue
                    try:
                        finding = json.loads(line)
                        normalized = self._normalize_finding(finding, target)
                        if normalized:
                            yield normalized
                    except json.JSONDecodeError:
                        logger.debug(f"Nuclei non-JSON stdout: {line[:200]}")
                        continue
            finally:
                timer.cancel()

            stderr_output = process.stderr.read()
            if stderr_output:
                logger.info(f"Nuclei stderr: {stderr_output[:500]}")

            process.wait(timeout=5)
            logger.info(f"Nuclei process exited with code {process.returncode}")

        except Exception as e:
            logger.error(f"Nuclei streaming error: {str(e)}")

    def _normalize_finding(self, raw: dict, target: str) -> dict | None:
        """Normalize a raw Nuclei JSONL finding to our internal format."""
        try:
            info = raw.get("info", {})
            severity_str = info.get("severity", "info").lower()
            cvss_score, cvss_vector = nuclei_severity_to_cvss(severity_str)

            # Extract CWE if available
            classification = info.get("classification", {})
            cwe_ids = classification.get("cwe-id", [])
            cwe_id = cwe_ids[0] if cwe_ids else None
            cwe_info = get_cwe_info(cwe_id) if cwe_id else {}

            # Extract CVE references
            cve_ids = classification.get("cve-id", [])
            references = info.get("reference", [])
            if isinstance(references, list):
                references = "\n".join(references)

            return {
                "title": info.get("name", raw.get("template-id", "Unknown Finding")),
                "description": info.get("description", ""),
                "severity": severity_str,
                "cvss_score": cvss_score,
                "cvss_vector": cvss_vector,
                "cwe_id": cwe_id,
                "cwe_name": cwe_info.get("name", ""),
                "url": raw.get("matched-at", raw.get("host", target)),
                "evidence": raw.get("extracted-results", raw.get("matcher-name", "")),
                "request_data": raw.get("request", ""),
                "response_data": raw.get("response", "")[:2000] if raw.get("response") else "",
                "remediation": info.get("remediation", ""),
                "reference_urls": references if isinstance(references, str) else "",
                "source": "nuclei",
                "template_id": raw.get("template-id", ""),
            }
        except Exception as e:
            logger.error(f"Error normalizing Nuclei finding: {e}")
            return None


# Module-level instance
nuclei_engine = NucleiEngine()
