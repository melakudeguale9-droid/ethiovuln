"""
EthioVuln — OWASP ZAP Scan Engine
Integrates with ZAP API for spidering/crawling and active vulnerability scanning.
"""

import time
import logging
from typing import Callable
from app.config import get_settings
from app.utils.cvss import zap_risk_to_cvss
from app.utils.cwe_mapping import get_cwe_info

settings = get_settings()
logger = logging.getLogger(__name__)


class ZapEngine:
    """
    OWASP ZAP API client for automated spidering and active scanning.
    Requires ZAP to be running in daemon mode.
    """

    def __init__(self, zap_url: str | None = None, api_key: str | None = None):
        self.zap_url = zap_url or settings.ZAP_API_URL
        self.api_key = api_key or settings.ZAP_API_KEY
        self._zap = None

    @property
    def zap(self):
        """Lazy-initialize ZAP client connection."""
        if self._zap is None:
            try:
                from zapv2 import ZAPv2
                self._zap = ZAPv2(
                    apikey=self.api_key,
                    proxies={
                        "http": self.zap_url,
                        "https": self.zap_url,
                    },
                )
            except ImportError:
                logger.error("zaproxy package not installed. Run: pip install zaproxy")
                raise
            except Exception as e:
                logger.error(f"Failed to connect to ZAP at {self.zap_url}: {e}")
                raise
        return self._zap

    def run_spider(self, target: str, progress_callback: Callable | None = None) -> list[str]:
        """
        Run ZAP spider to crawl and discover pages.
        
        Args:
            target: URL to spider
            progress_callback: Optional callback(progress_pct, message) for updates
            
        Returns:
            List of discovered URLs
        """
        logger.info(f"Starting ZAP spider on {target}")

        try:
            scan_id = self.zap.spider.scan(target)

            while True:
                progress = int(self.zap.spider.status(scan_id))
                if progress_callback:
                    progress_callback(progress, f"Spidering: {progress}% complete")
                if progress >= 100:
                    break
                time.sleep(2)

            results = self.zap.spider.results(scan_id)
            logger.info(f"Spider discovered {len(results)} URLs")
            return results

        except Exception as e:
            logger.error(f"ZAP spider error: {e}")
            return []

    def run_active_scan(self, target: str, progress_callback: Callable | None = None) -> list[dict]:
        """
        Run ZAP active scan for vulnerability detection.
        
        Args:
            target: URL to scan
            progress_callback: Optional callback(progress_pct, message) for updates
            
        Returns:
            List of normalized vulnerability dictionaries
        """
        logger.info(f"Starting ZAP active scan on {target}")

        try:
            scan_id = self.zap.ascan.scan(target)

            while True:
                progress = int(self.zap.ascan.status(scan_id))
                if progress_callback:
                    progress_callback(progress, f"Active scanning: {progress}% complete")
                if progress >= 100:
                    break
                time.sleep(5)

            # Fetch all alerts
            alerts = self.zap.core.alerts(baseurl=target)
            logger.info(f"Active scan found {len(alerts)} alerts")

            findings = []
            for alert in alerts:
                normalized = self._normalize_alert(alert, target)
                if normalized:
                    findings.append(normalized)

            return findings

        except Exception as e:
            logger.error(f"ZAP active scan error: {e}")
            return []

    def run_full_scan(self, target: str, progress_callback: Callable | None = None) -> list[dict]:
        """
        Execute full ZAP workflow: Spider → Active Scan → Collect Results.
        """
        def spider_progress(pct, msg):
            # Spider is 0-30% of total
            overall = int(pct * 0.3)
            if progress_callback:
                progress_callback(overall, msg)

        def scan_progress(pct, msg):
            # Active scan is 30-100% of total
            overall = 30 + int(pct * 0.7)
            if progress_callback:
                progress_callback(overall, msg)

        # Phase 1: Spider
        self.run_spider(target, spider_progress)

        # Phase 2: Active Scan
        findings = self.run_active_scan(target, scan_progress)

        return findings

    def _normalize_alert(self, alert: dict, target: str) -> dict | None:
        """Normalize a ZAP alert to our internal vulnerability format."""
        try:
            risk_str = alert.get("risk", "Informational")
            cvss_score, cvss_vector = zap_risk_to_cvss(risk_str)

            # Map severity string
            severity_map = {
                "High": "high",
                "Medium": "medium",
                "Low": "low",
                "Informational": "info",
            }
            severity = severity_map.get(risk_str, "info")

            # Extract CWE
            cwe_id_raw = alert.get("cweid", "")
            cwe_id = f"CWE-{cwe_id_raw}" if cwe_id_raw and cwe_id_raw != "-1" else None
            cwe_info = get_cwe_info(cwe_id) if cwe_id else {}

            # Build reference URLs
            reference = alert.get("reference", "")

            return {
                "title": alert.get("alert", alert.get("name", "Unknown ZAP Finding")),
                "description": alert.get("description", ""),
                "severity": severity,
                "cvss_score": cvss_score,
                "cvss_vector": cvss_vector,
                "cwe_id": cwe_id,
                "cwe_name": cwe_info.get("name", ""),
                "url": alert.get("url", target),
                "evidence": alert.get("evidence", ""),
                "request_data": alert.get("messageId", ""),
                "response_data": "",
                "remediation": alert.get("solution", ""),
                "reference_urls": reference,
                "source": "zap",
                "template_id": str(alert.get("pluginId", "")),
            }
        except Exception as e:
            logger.error(f"Error normalizing ZAP alert: {e}")
            return None

    def cleanup(self):
        """Clean up ZAP session data."""
        try:
            self.zap.core.new_session()
        except Exception:
            pass


# Module-level instance
zap_engine = ZapEngine()
