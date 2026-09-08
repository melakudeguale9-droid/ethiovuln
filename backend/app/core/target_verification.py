"""
EthioVuln — Target Verification System
Validates scan targets to prevent SSRF and unauthorized scanning.
"""

import re
import socket
import ipaddress
from urllib.parse import urlparse
from dataclasses import dataclass
from enum import Enum


class VerificationStatus(str, Enum):
    VALID = "valid"
    INVALID_URL = "invalid_url"
    PRIVATE_IP = "private_ip"
    DNS_FAILURE = "dns_failure"
    BLOCKED_DOMAIN = "blocked_domain"
    INVALID_SCHEME = "invalid_scheme"


@dataclass
class VerificationResult:
    status: VerificationStatus
    message: str
    resolved_ip: str | None = None
    domain: str | None = None
    is_valid: bool = False


# Domains that must never be scanned
BLOCKED_DOMAINS = {
    "localhost",
    "localhost.localdomain",
    "broadcasthost",
    "ip6-localhost",
    "ip6-loopback",
    "ip6-localnet",
    "ip6-mcastprefix",
    "ip6-allnodes",
    "ip6-allrouters",
}

# Additional blocked TLDs / patterns
BLOCKED_PATTERNS = [
    r"\.local$",
    r"\.internal$",
    r"\.corp$",
    r"\.home$",
    r"\.lan$",
    r"^10\.\d+\.\d+\.\d+$",
    r"^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$",
    r"^192\.168\.\d+\.\d+$",
    r"^127\.\d+\.\d+\.\d+$",
    r"^0\.0\.0\.0$",
    r"^169\.254\.\d+\.\d+$",
]


class TargetVerifier:
    """
    Three-tier target verification:
    1. URL format validation
    2. DNS resolution + private IP blocking (SSRF protection)
    3. Domain blocklist check
    """

    ALLOWED_SCHEMES = {"http", "https"}

    def validate_url(self, url: str) -> VerificationResult:
        """Validate URL format and scheme."""
        try:
            parsed = urlparse(url)

            if not parsed.scheme:
                return VerificationResult(
                    status=VerificationStatus.INVALID_URL,
                    message="URL must include a scheme (http:// or https://)",
                )

            if parsed.scheme.lower() not in self.ALLOWED_SCHEMES:
                return VerificationResult(
                    status=VerificationStatus.INVALID_SCHEME,
                    message=f"Scheme '{parsed.scheme}' is not allowed. Use http:// or https://",
                )

            if not parsed.hostname:
                return VerificationResult(
                    status=VerificationStatus.INVALID_URL,
                    message="URL must include a valid hostname",
                )

            domain = parsed.hostname.lower()

            # Check blocked domains
            if domain in BLOCKED_DOMAINS:
                return VerificationResult(
                    status=VerificationStatus.BLOCKED_DOMAIN,
                    message=f"Domain '{domain}' is blocked. Cannot scan localhost or internal domains.",
                    domain=domain,
                )

            # Check blocked patterns
            for pattern in BLOCKED_PATTERNS:
                if re.match(pattern, domain):
                    return VerificationResult(
                        status=VerificationStatus.BLOCKED_DOMAIN,
                        message=f"Domain '{domain}' matches a blocked pattern. Internal/private domains cannot be scanned.",
                        domain=domain,
                    )

            return VerificationResult(
                status=VerificationStatus.VALID,
                message="URL format is valid",
                domain=domain,
                is_valid=True,
            )

        except Exception as e:
            return VerificationResult(
                status=VerificationStatus.INVALID_URL,
                message=f"Invalid URL: {str(e)}",
            )

    def check_dns(self, domain: str) -> VerificationResult:
        """Resolve domain DNS and check if the IP is private."""
        try:
            ip_address_str = socket.gethostbyname(domain)
            ip_obj = ipaddress.ip_address(ip_address_str)

            if ip_obj.is_private:
                return VerificationResult(
                    status=VerificationStatus.PRIVATE_IP,
                    message=f"Domain '{domain}' resolves to private IP {ip_address_str}. "
                    f"Scanning private/internal IPs is not allowed (SSRF protection).",
                    resolved_ip=ip_address_str,
                    domain=domain,
                )

            if ip_obj.is_loopback:
                return VerificationResult(
                    status=VerificationStatus.PRIVATE_IP,
                    message=f"Domain '{domain}' resolves to loopback address {ip_address_str}.",
                    resolved_ip=ip_address_str,
                    domain=domain,
                )

            if ip_obj.is_link_local:
                return VerificationResult(
                    status=VerificationStatus.PRIVATE_IP,
                    message=f"Domain '{domain}' resolves to link-local address {ip_address_str}.",
                    resolved_ip=ip_address_str,
                    domain=domain,
                )

            if ip_obj.is_reserved:
                return VerificationResult(
                    status=VerificationStatus.PRIVATE_IP,
                    message=f"Domain '{domain}' resolves to reserved address {ip_address_str}.",
                    resolved_ip=ip_address_str,
                    domain=domain,
                )

            return VerificationResult(
                status=VerificationStatus.VALID,
                message=f"Domain '{domain}' resolves to {ip_address_str}",
                resolved_ip=ip_address_str,
                domain=domain,
                is_valid=True,
            )

        except socket.gaierror:
            return VerificationResult(
                status=VerificationStatus.DNS_FAILURE,
                message=f"DNS resolution failed for domain '{domain}'. "
                f"The domain may not exist or DNS is unreachable.",
                domain=domain,
            )
        except Exception as e:
            return VerificationResult(
                status=VerificationStatus.DNS_FAILURE,
                message=f"DNS check error: {str(e)}",
                domain=domain,
            )

    def verify_target(self, url: str) -> VerificationResult:
        """
        Full target verification pipeline.
        Returns a VerificationResult indicating whether the target is safe to scan.
        """
        # Step 1: Validate URL format
        url_result = self.validate_url(url)
        if not url_result.is_valid:
            return url_result

        # Step 2: DNS resolution + SSRF protection
        dns_result = self.check_dns(url_result.domain)
        if not dns_result.is_valid:
            return dns_result

        return VerificationResult(
            status=VerificationStatus.VALID,
            message=f"Target verified: {url_result.domain} -> {dns_result.resolved_ip}",
            resolved_ip=dns_result.resolved_ip,
            domain=url_result.domain,
            is_valid=True,
        )


# Module-level instance for convenience
target_verifier = TargetVerifier()
