'use client';

import React from 'react';
import Link from 'next/link';

/* ─── Self-Contained SVG Solution Icons ────────────────────────────────────── */
function GitCommitIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="1.05" y1="12" x2="7" y2="12" />
      <line x1="17.01" y1="12" x2="22.96" y2="12" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function RadarGlobeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SpiderBugIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="2.2" />
      <ellipse cx="12" cy="14" rx="3.5" ry="4.5" />
      <path d="M10.8 5.8 L9.8 4.2 M13.2 5.8 L14.2 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9.5 8 C6 6.5, 4 8, 3.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M9 11.5 C5 10.5, 3.5 13, 3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M9 14.5 C5 15, 3.5 18, 3.2 20.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M14.5 8 C18 6.5, 20 8, 20.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M15 11.5 C19 10.5, 20.5 13, 21 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M15 14.5 C19 15, 20.5 18, 20.8 20.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function NetworkNodesIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="16" y="2" width="6" height="6" rx="1" />
      <rect x="9" y="16" width="6" height="6" rx="1" />
      <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <line x1="12" y1="13" x2="12" y2="16" />
    </svg>
  );
}

function ApiCloudIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <polyline points="10 13 8 15 10 17" />
      <polyline points="14 13 16 15 14 17" />
    </svg>
  );
}

function CheckmarkIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ─── Type Interfaces ──────────────────────────────────────────────────────── */
export interface SolutionTool {
  name: string;
  role: string;
  engine: string;
  launchHref: string;
  badge?: string;
}

export interface SolutionDetail {
  id: string;
  badge: string;
  popular?: boolean;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  accentHoverGlow: string;
  icon: React.ReactNode;
  detailTools: SolutionTool[];
  breakdown: {
    heading: string;
    points: {
      title: string;
      description: string;
    }[];
  };
  telemetryCard: {
    label: string;
    status: string;
    statusColor: string;
    logs: string[];
  };
  supportedTags: string[];
  ctaLabel: string;
  ctaHref: string;
}

/* ─── Solutions Data (One-By-One Comprehensive Tool Mapping) ─────────────────── */
export const SOLUTIONS_DATA: SolutionDetail[] = [
  {
    id: 'webapp',
    badge: 'DYNAMIC WEB DAST',
    popular: true,
    title: 'Web Application Vulnerability Pentesting',
    subtitle: 'High-Impact DAST, Dynamic Crawling & Exploitation Proofs',
    description:
      'Comprehensive automated penetration testing for modern SPAs, server-rendered apps, and legacy architectures across the OWASP Top 10 with verified exploit reproduction.',
    accentColor: 'text-amber-400',
    accentBorder: 'border-amber-500/30',
    accentBg: 'bg-amber-500/10',
    accentHoverGlow: 'hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.18)]',
    icon: <SpiderBugIcon className="w-8 h-8 text-amber-400" />,
    detailTools: [
      {
        name: 'Website Vulnerability Scanner',
        role: 'Full-scope crawler-based dynamic DAST assessment with soft-404 filtering',
        engine: 'Core DAST',
        launchHref: '/dashboard/scans/new?mode=deep',
        badge: 'Core Tool',
      },
      {
        name: 'Nuclei Template Engine',
        role: '8,000+ verified community & enterprise YAML rules for CVE signatures',
        engine: 'Go Async IO',
        launchHref: '/dashboard/scans/new?engine=nuclei',
        badge: '8k Rules',
      },
      {
        name: 'OWASP ZAP Dynamic Spider',
        role: 'Headless AJAX crawler, session cookie handling & active parameter probing',
        engine: 'OWASP Core',
        launchHref: '/dashboard/scans/new?engine=zap',
        badge: 'Dynamic',
      },
      {
        name: 'Active Injection Prover',
        role: 'Benign exploit validation generating verifiable cURL proofs for dev fixes',
        engine: 'DAST PoC',
        launchHref: '/dashboard/scans/new?type=deep',
        badge: 'PoC Proofs',
      },
    ],
    breakdown: {
      heading: 'In-Depth Architectural Capabilities',
      points: [
        {
          title: 'Full OWASP Top 10 Injection Suite',
          description:
            'Deep parameter verification covering SQL Injection (Boolean, Time-based, Error), Cross-Site Scripting (Reflected, Stored, DOM), SSRF, SSTI, and Remote Code Execution.',
        },
        {
          title: 'Pre-Flight Anti-SSRF Zero-Trust Gateway',
          description:
            'Verifies domain DNS in real-time, blocking private RFC 1918 subnets, cloud metadata IPs (169.254.169.254), and local loopbacks to prevent hazardous request forgery.',
        },
        {
          title: 'Heterogeneous Finding Deduplication & CVSS v3.1',
          description:
            'Correlates raw findings from Nuclei, ZAP, and custom fuzzers into a unified risk posture, mapping each flaw to authoritative MITRE CWE definitions.',
        },
      ],
    },
    telemetryCard: {
      label: 'Web Application Telemetry',
      status: 'Assessment Completed • 0 False Positives',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      logs: [
        '➜ Target: https://target-app.com (HTTP 200 OK)',
        '➜ Nuclei Core: 8,420 YAML checks completed in 42s',
        '➜ OWASP ZAP: 184 endpoints crawled, 0 Critical leaks',
        '➜ Anti-SSRF: Dual-stack boundary verified (Non-routable barred)',
      ],
    },
    supportedTags: ['OWASP Top 10', 'SQLi & XSS', 'Anti-SSRF Gate', 'CVE Templates', 'Headless AJAX'],
    ctaLabel: 'Launch Web App Scan',
    ctaHref: '/dashboard/scans/new?mode=deep',
  },
  {
    id: 'network',
    badge: 'PERIMETER INFRASTRUCTURE',
    title: 'Network & Infrastructure Security',
    subtitle: 'Host Discovery, Port Intelligence & SSL/TLS Configuration',
    description:
      'Complete infrastructure reconnaissance and security auditing for public IP ranges, host machines, cloud load balancers, and exposed service perimeters.',
    accentColor: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
    accentHoverGlow: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.18)]',
    icon: <NetworkNodesIcon className="w-8 h-8 text-cyan-400" />,
    detailTools: [
      {
        name: 'Network Service Scanner',
        role: 'High-speed TCP/UDP port mapping and live banner grabbing for server discovery',
        engine: 'NetScan Core',
        launchHref: '/dashboard/scans/new?type=network',
        badge: 'Port Map',
      },
      {
        name: 'Fast SYN Port Scanner',
        role: 'Asynchronous network port discovery across top 1,000 enterprise network ports',
        engine: 'TCP/UDP Engine',
        launchHref: '/dashboard/scans/new?type=port',
        badge: 'Fast SYN',
      },
      {
        name: 'SSL/TLS Cipher Suite Auditor',
        role: 'Verifies weak cipher suites (RC4, 3DES), deprecated TLS 1.0/1.1 protocols, and certificates',
        engine: 'TLS Inspector',
        launchHref: '/dashboard/scans/new?type=ssl',
        badge: 'TLS 1.3',
      },
      {
        name: 'DNS Rebinding Barrier',
        role: 'Real-time dual-stack IPv4/IPv6 boundary enforcement preventing server-side request forgery',
        engine: 'DNS Gateway',
        launchHref: '/dashboard/scans/new?type=dns',
        badge: 'Zero-Trust',
      },
    ],
    breakdown: {
      heading: 'In-Depth Architectural Capabilities',
      points: [
        {
          title: 'High-Concurrency Port Mapping',
          description:
            'Discovers open TCP/UDP services, daemon versions, and protocol configurations across enterprise subnets with non-disruptive, rate-throttled packet bursts.',
        },
        {
          title: 'Cryptographic Transport Auditing',
          description:
            'Inspects SSL/TLS handshake security, certificate trust chains, forward secrecy support, and flags insecure legacy ciphers susceptible to MITM attacks.',
        },
        {
          title: 'Infrastructure Banner Fingerprinting',
          description:
            'Extracts HTTP server headers, SSH versions, and database banners to alert teams on outdated, unpatched server software components.',
        },
      ],
    },
    telemetryCard: {
      label: 'Network Perimeter Telemetry',
      status: 'Infrastructure Hardened',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      logs: [
        '➜ Port 443/TCP: TLS 1.3 Strict-Transport-Security verified',
        '➜ Port 80/TCP: 301 Redirect to HTTPS enforced',
        '➜ Cipher Audit: 0 weak ciphers detected (ECDHE-RSA-AES256)',
        '➜ DNS Zone: Validated against RFC 1918 private IP range',
      ],
    },
    supportedTags: ['Port Auditing', 'TLS 1.3 / HSTS', 'Banner Grabbing', 'Cloud Perimeter', 'DNS Auditing'],
    ctaLabel: 'Scan Network Perimeter',
    ctaHref: '/dashboard/scans/new?type=network',
  },
  {
    id: 'api',
    badge: 'API TOP 10 & CLOUD',
    title: 'API & Cloud Perimeter Security',
    subtitle: 'REST, GraphQL & Cloud Storage Exposure Auditing',
    description:
      'Automated testing tailored for modern API gateways, microservices, and cloud storage buckets against the OWASP API Security Top 10.',
    accentColor: 'text-purple-400',
    accentBorder: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
    accentHoverGlow: 'hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]',
    icon: <ApiCloudIcon className="w-8 h-8 text-purple-400" />,
    detailTools: [
      {
        name: 'REST API Parameter Fuzzer',
        role: 'Automated payload fuzzing across forms, URL queries, and nested JSON request bodies',
        engine: 'FastAPI Fuzzer',
        launchHref: '/dashboard/scans/new?type=api',
        badge: 'REST Fuzz',
      },
      {
        name: 'GraphQL Schema Inspector',
        role: 'Detects unauthenticated introspection queries, query complexity DOS, and field enumeration',
        engine: 'GraphQL Core',
        launchHref: '/dashboard/scans/new?type=graphql',
        badge: 'GraphQL',
      },
      {
        name: 'Cloud Storage Bucket Probe',
        role: 'Audits public AWS S3, Azure Blob, and Google Cloud Storage permissions and directory listings',
        engine: 'Cloud Probe',
        launchHref: '/dashboard/scans/new?type=cloud',
        badge: 'S3/Azure',
      },
      {
        name: 'Regex Secret Extractor',
        role: 'Live pattern matching for exposed AWS keys, private SSH keys, JWT tokens, and database URIs',
        engine: 'Secret Recon',
        launchHref: '/dashboard/scans/new?engine=fuzzer',
        badge: 'Secret Leak',
      },
    ],
    breakdown: {
      heading: 'In-Depth Architectural Capabilities',
      points: [
        {
          title: 'OWASP API Security Top 10 Coverage',
          description:
            'Probes endpoints for Broken Object Level Authorization (BOLA), Mass Assignment, improper asset management, and missing rate-limiting protections.',
        },
        {
          title: 'GraphQL Introspection & Batch Attack Defense',
          description:
            'Simulates nested query recursion and alias batching attacks to verify that GraphQL engines are not vulnerable to denial-of-service degradation.',
        },
        {
          title: 'Leaked Cloud Credentials & Secret Exposure',
          description:
            'Systematically crawls client-side bundles and public endpoints for forgotten developer keys, access tokens, and staging environment credentials.',
        },
      ],
    },
    telemetryCard: {
      label: 'API Security & Secret Telemetry',
      status: 'API Gateway Protected',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      logs: [
        '➜ /api/v1/auth: Bearer token validation enforced',
        '➜ /graphql: Introspection disabled on production route',
        '➜ Secret Check: 0 exposed .env or AWS keys detected',
        '➜ Rate Limit: 100 req/min threshold verified',
      ],
    },
    supportedTags: ['OWASP API Top 10', 'GraphQL', 'BOLA Flaws', 'Cloud S3 / Blobs', 'JWT Verification'],
    ctaLabel: 'Audit API Gateway',
    ctaHref: '/dashboard/scans/new?type=api',
  },
  {
    id: 'devsecops',
    badge: 'SHIFT-LEFT SECURITY',
    title: 'DevSecOps & CI/CD Pipelines',
    subtitle: 'Automated Headless Security Gates for Engineering Teams',
    description:
      'Automated headless scans integrated directly into GitHub Actions, GitLab CI, and Bitbucket pipelines to catch vulnerabilities before code reaches production.',
    accentColor: 'text-sky-400',
    accentBorder: 'border-sky-500/30',
    accentBg: 'bg-sky-500/10',
    accentHoverGlow: 'hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.18)]',
    icon: <GitCommitIcon className="w-8 h-8 text-sky-400" />,
    detailTools: [
      {
        name: 'Headless CLI Runner',
        role: 'Single-command containerized security scanning for Docker & CI/CD workflow runners',
        engine: 'CLI v1.0',
        launchHref: '/dashboard/scans/new?mode=cli',
        badge: 'Docker CLI',
      },
      {
        name: 'CI/CD Security Gate',
        role: 'Automated pull request blocking policies based on quantitative CVSS score thresholds',
        engine: 'PR Interceptor',
        launchHref: '/dashboard/scans/new?mode=cli',
        badge: 'Gatekeeper',
      },
      {
        name: 'Automated Code Remediation',
        role: 'Real-time code-level patch instructions and reproducible curl proof commands',
        engine: 'Gemini AI Engine',
        launchHref: '/dashboard/scans/new?mode=cli',
        badge: 'AI Patch',
      },
      {
        name: 'Webhook & Slack Dispatcher',
        role: 'Instant vulnerability notifications sent to developer triage channels and ticketing tools',
        engine: 'Webhook Bus',
        launchHref: '/dashboard/settings',
        badge: 'Slack/Teams',
      },
    ],
    breakdown: {
      heading: 'In-Depth Architectural Capabilities',
      points: [
        {
          title: 'Automated Headless CI/CD Scans',
          description:
            'Execute lightweight, containerized DAST runs on ephemeral pull request preview URLs, staging branches, and internal test runners with zero manual intervention.',
        },
        {
          title: 'Fail-Safe Security Gates & PR Interception',
          description:
            'Intercept high-severity security vectors (SQLi, SSRF, RCE, CVEs) before production deployment with policy-driven rules that prevent merging risky code.',
        },
        {
          title: 'Instant Developer Feedback & Code Remediation',
          description:
            'Deliver real-time inline PR review annotations, Slack notifications, and webhook alerts with exact reproduction cURL commands and patch guidance.',
        },
      ],
    },
    telemetryCard: {
      label: 'GitHub Actions: security-gate.yml',
      status: 'Gate Passed (Merge Allowed)',
      statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      logs: [
        '➜ CLI runner initialized: v1.0.0 headless',
        '➜ Nuclei YAML engine: 8,000+ community rules executed in 38s',
        '➜ OWASP ZAP dynamic crawler: 0 High / 0 Critical findings',
        '➜ Exit status: 0 (No policy violations detected)',
      ],
    },
    supportedTags: ['GitHub Actions', 'GitLab CI', 'Bitbucket', 'Docker CLI', 'Jenkins'],
    ctaLabel: 'Explore CI/CD Scanner Mode',
    ctaHref: '/dashboard/scans/new?mode=cli',
  },
  {
    id: 'surface',
    badge: 'PERIMETER RECON',
    title: 'Attack Surface Management',
    subtitle: 'Continuous Asset Discovery & Shadow IT Identification',
    description:
      'Continuous external perimeter monitoring and asset discovery to identify shadow IT, forgotten subdomains, and exposed endpoints.',
    accentColor: 'text-indigo-400',
    accentBorder: 'border-indigo-500/30',
    accentBg: 'bg-indigo-500/10',
    accentHoverGlow: 'hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]',
    icon: <RadarGlobeIcon className="w-8 h-8 text-indigo-400" />,
    detailTools: [
      {
        name: 'Subdomain Discovery Engine',
        role: 'Combines passive DNS intelligence, Certificate Transparency logs, and brute-forcing',
        engine: 'SubFinder Core',
        launchHref: '/dashboard/scans/new?type=subdomain',
        badge: 'Subdomains',
      },
      {
        name: 'Shadow IT Perimeter Finder',
        role: 'Identifies unreferenced staging subdomains and abandoned test servers across your scope',
        engine: 'Asset Radar',
        launchHref: '/dashboard',
        badge: 'Shadow IT',
      },
      {
        name: 'Hidden Directory & Backup Fuzzer',
        role: '10,000+ wordlist fuzzing for .git, .env, .sql, and forgotten archives',
        engine: 'Smart Fuzzer',
        launchHref: '/dashboard/scans/new?engine=fuzzer',
        badge: 'Fuzzer',
      },
      {
        name: 'Dangling DNS Takeover Auditor',
        role: 'Probes dangling CNAME records pointing to unclaimed cloud services (S3, GitHub Pages)',
        engine: 'DNS Auditor',
        launchHref: '/dashboard/scans/new?type=dns',
        badge: 'Takeover',
      },
    ],
    breakdown: {
      heading: 'In-Depth Architectural Capabilities',
      points: [
        {
          title: 'Real-Time External Asset Mapping',
          description:
            'Continuous discovery of apex domains, cloud hostnames, and CDN endpoints to maintain an accurate, living inventory of your organization’s digital footprint.',
        },
        {
          title: 'Subdomain Enumeration & Port Intelligence',
          description:
            'Combines passive DNS intelligence, Certificate Transparency logs, and active port fingerprinting to reveal forgotten staging servers and exposed services.',
        },
        {
          title: 'Automated Shadow IT & Exposure Alerts',
          description:
            'Instantly detects unmanaged test environments, public `.git` folders, leaked `.env` credentials, and unauthenticated administrative consoles.',
        },
      ],
    },
    telemetryCard: {
      label: 'External Attack Surface Telemetry',
      status: 'Perimeter Protected',
      statusColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      logs: [
        '➜ Monitored Asset Scope: 142 public endpoints mapped',
        '➜ Subdomain inventory: 87 DNS zones actively indexed',
        '➜ Shadow IT alert: 0 unmonitored test servers exposed',
        '➜ Dangling CNAMEs: 0 takeover vulnerabilities found',
      ],
    },
    supportedTags: ['Subdomains', 'Cloud Assets', 'Port Intelligence', 'Shadow IT'],
    ctaLabel: 'Discover Attack Surface',
    ctaHref: '/dashboard',
  },
  {
    id: 'compliance',
    badge: 'AUDIT & GOVERNANCE',
    popular: true,
    title: 'SOC 2 & Compliance Auditing',
    subtitle: 'Continuous Evidence Collection & Regulatory Sign-Offs',
    description:
      'Comprehensive automated evidence collection and security sign-offs designed to meet rigorous compliance frameworks effortlessly.',
    accentColor: 'text-emerald-400',
    accentBorder: 'border-emerald-500/30',
    accentBg: 'bg-emerald-500/10',
    accentHoverGlow: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]',
    icon: <ShieldCheckIcon className="w-8 h-8 text-emerald-400" />,
    detailTools: [
      {
        name: 'CVSS v3.1 Quantitative Scoring',
        role: 'Standardized base, temporal, and environmental risk calculations mapped to CWEs',
        engine: 'CVSS Normalizer',
        launchHref: '/about#architecture',
        badge: 'CVSS v3.1',
      },
      {
        name: 'Executive & Technical PDF Generator',
        role: 'Cryptographically timestamped (SHA-256), auditor-ready deliverables with charts',
        engine: 'ReportLab Core',
        launchHref: '/dashboard/reports',
        badge: 'PDF Audit',
      },
      {
        name: 'MITRE CWE & OWASP Mapper',
        role: 'Direct cross-referencing against authoritative industry security taxonomies',
        engine: 'Taxonomy Engine',
        launchHref: '/about#vectors',
        badge: 'MITRE CWE',
      },
      {
        name: 'Automated Evidence Vault',
        role: 'Reproducible HTTP requests, response headers, and scan history audit trails',
        engine: 'Evidence Store',
        launchHref: '/dashboard',
        badge: 'Evidence',
      },
    ],
    breakdown: {
      heading: 'In-Depth Architectural Capabilities',
      points: [
        {
          title: 'Continuous Control Monitoring',
          description:
            'Replace manual annual audits with 24/7 continuous posture evaluation across all production perimeters, automatically logging control validation timestamps.',
        },
        {
          title: 'Multi-Framework Compliance Mapping',
          description:
            'Direct mapping against SOC 2 Type II (Security CC7.1, CC7.2), ISO/IEC 27001 (Annex A.8.8), PCI-DSS v4.0 (Req 6.5), and HIPAA Security Rule requirements.',
        },
        {
          title: 'Auditor-Ready Documentation & PDF Export',
          description:
            'Generate cryptographically signed, executive-grade PDF audit packages and structured JSON summaries for third-party compliance assessors in one click.',
        },
      ],
    },
    telemetryCard: {
      label: 'Enterprise Compliance Assessment',
      status: 'Compliance Verified (100%)',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      logs: [
        '✓ SOC 2 Type II: Continuous DAST verification active',
        '✓ ISO/IEC 27001: Technical vulnerability tests validated',
        '✓ PCI-DSS v4.0: Requirement 6.5 web app controls satisfied',
        '✓ SHA-256 Stamp: Cryptographic signature verified',
      ],
    },
    supportedTags: ['SOC 2 Type II', 'ISO 27001', 'PCI-DSS v4.0', 'HIPAA Security'],
    ctaLabel: 'View Compliance Standards',
    ctaHref: '/about',
  },
];

/* ─── Main Component ───────────────────────────────────────────────────────── */
export function SolutionsSection() {
  return (
    <section
      id="solutions"
      className="py-24 sm:py-32 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full relative scroll-mt-24 border-t border-slate-800/60"
    >
      {/* Section Header */}
      <div className="text-center w-full max-w-full mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm sm:text-base font-extrabold uppercase tracking-widest mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Enterprise Solutions &amp; Tool Suite</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-normal leading-relaxed">
          Continuous Security for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
            Modern Engineering Teams
          </span>
        </h2>

        <p className="mt-6 text-lg sm:text-xl text-gray-150 leading-relaxed tracking-normal font-normal">
          Rather than relying on isolated point-in-time penetration tests, EthioVuln provides full-spectrum offensive security across your entire deployment pipeline, regulatory audits, and external digital perimeter.
        </p>
      </div>

      {/* Solutions Cards Grid: One-by-One Listing with Dedicated Tools */}
      <div className="space-y-12">
        {SOLUTIONS_DATA.map((solution, idx) => (
          <div
            id={solution.id}
            key={solution.id}
            className={`rounded-3xl bg-[#111827] border border-slate-800 p-8 sm:p-12 transition-all duration-300 ${solution.accentHoverGlow} shadow-2xl relative overflow-hidden group scroll-mt-28`}
          >
            {/* Top Bar Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
              <div className="flex items-start sm:items-center gap-5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${solution.accentBg} ${solution.accentBorder}`}
                >
                  {solution.icon}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${solution.accentBg} ${solution.accentColor} ${solution.accentBorder}`}
                    >
                      {solution.badge}
                    </span>
                    {solution.popular && (
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30">
                        Enterprise Favorite
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500">
                      SOLUTION #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-400 mt-1 font-medium">
                    {solution.subtitle}
                  </p>
                </div>
              </div>

              <Link
                href={solution.ctaHref}
                className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer shadow-md self-start lg:self-center"
              >
                <span>{solution.ctaLabel}</span>
                <ArrowRightIcon className="w-5 h-5 text-cyan-400" />
              </Link>
            </div>

            {/* Description */}
            <div className="py-8">
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-normal">
                {solution.description}
              </p>
            </div>

            {/* Architectural Grid & Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-7 space-y-6">
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-400">
                  {solution.breakdown.heading}
                </h4>

                <div className="space-y-5">
                  {solution.breakdown.points.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className={`shrink-0 mt-1 ${solution.accentColor}`}>
                          <CheckmarkIcon className="w-5 h-5" />
                        </span>
                        <div>
                          <h5 className="text-base sm:text-lg font-bold text-slate-100 mb-1.5">
                            {pt.title}
                          </h5>
                          <p className="text-base text-slate-400 leading-relaxed font-normal">
                            {pt.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="rounded-2xl bg-[#070B14] border border-slate-800 p-6 font-mono text-sm shadow-inner flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400 text-xs font-semibold">
                      <span className="truncate">{solution.telemetryCard.label}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="space-y-2.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {solution.telemetryCard.logs.map((log, lIdx) => (
                        <div key={lIdx} className="truncate">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-xs sm:text-sm flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Execution Status:</span>
                    <span
                      className={`px-3 py-1 rounded-lg border font-bold text-xs ${solution.telemetryCard.statusColor}`}
                    >
                      {solution.telemetryCard.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800/80">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 block mb-3">
                    Validated Ecosystem &amp; Standards
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {solution.supportedTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-[#111827] text-slate-300 border border-slate-700/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── One-by-One Detail Tools Grid ─── */}
            <div className="mt-10 pt-8 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span>⚙</span>
                  <span>Integrated Solution Tools (One-By-One Breakdown)</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {solution.detailTools.length} Specialized Scanning Tools &amp; Engines
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {solution.detailTools.map((tool, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-4 rounded-xl bg-[#0B1120] border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group/tool shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-white group-hover/tool:text-cyan-300 transition-colors">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700/60 shrink-0">
                          {tool.engine}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {tool.role}
                      </p>
                    </div>

                    <Link
                      href={tool.launchHref}
                      className="inline-flex items-center justify-between text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2 border-t border-slate-800/80 group-hover/tool:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>Launch Tool</span>
                      <span>→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Architectural Callout */}
      <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-100">
              Need Custom Air-Gapped Deployments or Private VPC Agents?
            </h4>
            <p className="text-base text-slate-400 mt-1">
              EthioVuln supports dedicated on-premise Kubernetes clusters, private cloud VPC scan nodes, and air-gapped compliance networks.
            </p>
          </div>
        </div>

        <Link
          href="/about"
          className="shrink-0 px-8 py-4 rounded-xl font-extrabold text-base bg-cyan-500 hover:bg-cyan-400 !text-slate-950 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          Talk to a Security Architect →
        </Link>
      </div>
    </section>
  );
}
