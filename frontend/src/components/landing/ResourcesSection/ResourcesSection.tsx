'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── Self-Contained SVG Resource Icons ───────────────────────────────────── */
function BookOpenIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function TerminalIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
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

function CodeBracketIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function GitMergeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  );
}

function FileCodeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
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
export interface ResourceTool {
  name: string;
  role: string;
  engine: string;
  launchHref: string;
  badge?: string;
}

export interface ResourceDetail {
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
  detailTools: ResourceTool[];
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

/* ─── Resources Data (One-By-One Detailed Tool Mapping) ───────────────────────── */
export const RESOURCES_DATA: ResourceDetail[] = [
  {
    id: 'taxonomy',
    badge: 'VULNERABILITY TAXONOMY',
    popular: true,
    title: 'Vulnerability Taxonomy & CVSS v3.1 Matrix',
    subtitle: 'Standardized 8-Tier Severity Vector Classification & MITRE CWE Mapping',
    description:
      'EthioVuln organizes all dynamic web assessment checks into 8 standardized tiers. Findings are assigned mathematically reproducible CVSS v3.1 base vectors with precise attack vector parameters and CWE cross-referencing.',
    accentColor: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
    accentHoverGlow: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.18)]',
    icon: <BookOpenIcon className="w-8 h-8 text-cyan-400" />,
    detailTools: [
      {
        name: '8 Assessment Tiers',
        role: 'Structured hierarchy from passive header telemetry to full multi-engine exploitation',
        engine: 'Taxonomy Engine',
        launchHref: '/about#vectors',
        badge: '8 Tiers',
      },
      {
        name: 'CVSS v3.1 Scoring Calculator',
        role: 'Standardized base, temporal, and environmental vector scoring (FIRST.org spec)',
        engine: 'CVSS Core',
        launchHref: '/about#taxonomy',
        badge: 'FIRST.org',
      },
      {
        name: 'MITRE CWE-2024 Mapper',
        role: 'Direct cross-referencing with official MITRE Common Weakness Enumerations',
        engine: 'MITRE Taxonomy',
        launchHref: '/about#taxonomy',
        badge: 'CWE-2024',
      },
      {
        name: 'Risk Heatmap Visualizer',
        role: 'Multi-asset vulnerability posture and risk exposure velocity distribution matrix',
        engine: 'Visual Posture',
        launchHref: '/about#taxonomy',
        badge: 'Heatmap',
      },
    ],
    breakdown: {
      heading: 'Taxonomy Governance Standards',
      points: [
        {
          title: 'Deterministic Severity Mapping',
          description:
            'Each finding is categorized strictly into Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9), and Informational (0.0).',
        },
        {
          title: 'Multi-Engine Finding Deduplication',
          description:
            'Findings from Nuclei, OWASP ZAP, and custom fuzzers are deduplicated and mapped to a single authoritative CWE root cause.',
        },
        {
          title: 'Reproducible Vector Strings',
          description:
            'Raw CVSS strings (e.g. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H) are embedded directly into PDF and JSON exports.',
        },
      ],
    },
    telemetryCard: {
      label: 'Taxonomy Standards Engine',
      status: '8 Tiers Calibrated • MITRE CWE-2024 Synced',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      logs: [
        '➜ Vector Schema: FIRST.org CVSS v3.1 Equations Verified',
        '➜ Taxonomy: 8 Tiers (Passive Headers to Full Enterprise DAST)',
        '➜ MITRE Sync: CWE-89, CWE-79, CWE-918, CWE-22, CWE-200 Active',
        '➜ Output: Unified JSON Schema & Vector PDF Exports',
      ],
    },
    supportedTags: ['CVSS v3.1', 'MITRE CWE', '8 Tiers', 'Deduplication', 'Exploit Ranking'],
    ctaLabel: 'Explore 8 Security Vectors',
    ctaHref: '/about#vectors',
  },
  {
    id: 'cli',
    badge: 'CLI SCANNER GUIDE',
    title: 'CLI Scanner Documentation & Docker Guide',
    subtitle: 'Single-Command Headless DAST Execution & Containerization',
    description:
      'Deploy EthioVuln directly inside development terminals and automated CI/CD runners using our single-line curl script or lightweight containerized Docker images with customizable flags.',
    accentColor: 'text-emerald-400',
    accentBorder: 'border-emerald-500/30',
    accentBg: 'bg-emerald-500/10',
    accentHoverGlow: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]',
    icon: <TerminalIcon className="w-8 h-8 text-emerald-400" />,
    detailTools: [
      {
        name: 'Headless CLI Binary',
        role: 'Self-contained command-line executable with colorized terminal logging and progress bars',
        engine: 'Go / Python CLI',
        launchHref: '/dashboard/scans/new',
        badge: 'CLI Binary',
      },
      {
        name: 'Docker Runner Container',
        role: 'OCI-compliant container image (ghcr.io/ethiovuln/scanner:latest) for isolated runs',
        engine: 'Docker / Podman',
        launchHref: '/dashboard/scans/new',
        badge: 'Docker',
      },
      {
        name: 'One-Liner Install Script',
        role: 'Automated platform detection and installation script via curl',
        engine: 'Shell Script',
        launchHref: '/dashboard/scans/new',
        badge: 'curl installer',
      },
      {
        name: 'CI/CD Exit Code Enforcer',
        role: 'Returns non-zero exit codes on Critical/High vulnerabilities to block hazardous merges',
        engine: 'CI Quality Gate',
        launchHref: '/dashboard/scans/new',
        badge: 'Exit Code',
      },
    ],
    breakdown: {
      heading: 'Command-Line Capabilities & Syntax',
      points: [
        {
          title: 'Single-Line Terminal Command',
          description:
            'Run instant audits with simple flags: ethiovuln scan --target https://example.com --mode deep --output report.pdf',
        },
        {
          title: 'Headless CI/CD Mode',
          description:
            'Supports non-interactive execution (--quiet, --json) tailored for headless runners with minimal resource overhead.',
        },
        {
          title: 'Custom Header & Token Injection',
          description:
            'Pass authentication headers and cookies (--header "Authorization: Bearer <TOKEN>") for authenticated session scans.',
        },
      ],
    },
    telemetryCard: {
      label: 'CLI Terminal Execution',
      status: 'CLI Ready • Exit Code 0 Compliant',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      logs: [
        '➜ $ ethiovuln scan --target https://app.corp.io --mode deep',
        '➜ [OK] Resolving DNS & Verifying Pre-Flight Anti-SSRF Gate...',
        '➜ [OK] Nuclei Core: 8,420 YAML signatures evaluated',
        '➜ [OK] Report compiled: ./ethiovuln-audit-report.pdf (SHA-256 Valid)',
      ],
    },
    supportedTags: ['CLI Scanner', 'Docker Container', 'curl Install', 'Exit Codes', 'Headless Runs'],
    ctaLabel: 'Launch Assessment in Browser',
    ctaHref: '/dashboard/scans/new',
  },
  {
    id: 'owasp',
    badge: 'OWASP TOP 10 (2024)',
    title: 'OWASP Top 10 Coverage Matrix',
    subtitle: 'Comprehensive Dynamic Testing Across All Critical Threat Vectors',
    description:
      'Active verification matrix targeting the OWASP Top 10 web application security risks: Injection, Broken Access Control, Cryptographic Failures, Insecure Design, Security Misconfiguration, and SSRF.',
    accentColor: 'text-indigo-400',
    accentBorder: 'border-indigo-500/30',
    accentBg: 'bg-indigo-500/10',
    accentHoverGlow: 'hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]',
    icon: <ShieldCheckIcon className="w-8 h-8 text-indigo-400" />,
    detailTools: [
      {
        name: 'A01 Broken Access Control Prober',
        role: 'Probes IDOR flaws, unauthorized URL access, and horizontal privilege escalation',
        engine: 'Access Control',
        launchHref: '/about#vectors',
        badge: 'A01 IDOR',
      },
      {
        name: 'A03 Injection Verifier',
        role: 'Deep parameter verification for SQL Injection, XSS, Command Injection, and SSTI',
        engine: 'Active Inoculator',
        launchHref: '/about#vectors',
        badge: 'A03 SQLi/XSS',
      },
      {
        name: 'A10 Anti-SSRF Pre-Flight Gateway',
        role: 'Strict boundary isolation blocking RFC 1918 subnets, cloud metadata, and loopbacks',
        engine: 'SSRF Boundary',
        launchHref: '/about#vectors',
        badge: 'A10 SSRF',
      },
      {
        name: 'JWT & Session Token Auditor',
        role: 'Audits weak HMAC keys, algorithm none attacks, missing HttpOnly flags, and token expiry',
        engine: 'Token Inspector',
        launchHref: '/about#vectors',
        badge: 'JWT Audit',
      },
    ],
    breakdown: {
      heading: 'OWASP Threat Mitigation Framework',
      points: [
        {
          title: 'Full Injection Spectrum',
          description:
            'Tests error-based, boolean-based, and time-based SQL injection, reflected/stored/DOM XSS, and command injection.',
        },
        {
          title: 'Security Misconfiguration Radar',
          description:
            'Audits CSP policies, HSTS enforcement, CORS headers, directory listing, and default administrative logins.',
        },
        {
          title: 'Verifiable PoC Reproduction',
          description:
            'Every identified flaw includes reproduction cURL commands and raw HTTP traffic traces to accelerate fixes.',
        },
      ],
    },
    telemetryCard: {
      label: 'OWASP Matrix Telemetry',
      status: '10 / 10 Vectors Monitored',
      statusColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      logs: [
        '➜ Vector A01 (Broken Access Control): IDOR probe suite active',
        '➜ Vector A03 (Injection): SQLi, XSS, and SSTI test payloads ready',
        '➜ Vector A05 (Security Misconfig): Header & CORS audits enabled',
        '➜ Vector A10 (SSRF): Pre-Flight Zero-Trust anti-SSRF barrier verified',
      ],
    },
    supportedTags: ['OWASP Top 10', 'SQLi & XSS', 'Anti-SSRF', 'IDOR', 'Security Headers'],
    ctaLabel: 'Review OWASP Coverage',
    ctaHref: '/about#vectors',
  },
  {
    id: 'api',
    badge: 'FASTAPI / OPENAPI',
    title: 'FastAPI & REST Documentation',
    subtitle: 'Interactive OpenAPI 3.0, Pydantic Models & Async Webhooks',
    description:
      'Developer-first API integration documentation powered by Swagger UI and ReDoc. Dispatch scan tasks asynchronously, poll real-time statuses, and subscribe to scan completion webhooks.',
    accentColor: 'text-purple-400',
    accentBorder: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
    accentHoverGlow: 'hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]',
    icon: <CodeBracketIcon className="w-8 h-8 text-purple-400" />,
    detailTools: [
      {
        name: 'Interactive Swagger UI',
        role: 'Live testing interface for all scan endpoints, parameters, and authentication tokens',
        engine: 'OpenAPI 3.0',
        launchHref: 'http://localhost:8000/docs',
        badge: 'Swagger UI',
      },
      {
        name: 'ReDoc Schema Explorer',
        role: 'Clean, searchable technical reference for data schemas, error codes, and responses',
        engine: 'ReDoc',
        launchHref: 'http://localhost:8000/redoc',
        badge: 'ReDoc',
      },
      {
        name: 'Pydantic V2 Schemas',
        role: 'Strict runtime type validation ensuring robust JSON payload parsing without crashes',
        engine: 'Pydantic V2',
        launchHref: 'http://localhost:8000/docs',
        badge: 'Pydantic',
      },
      {
        name: 'Webhook Event Bus',
        role: 'Automated JSON notification payloads dispatched to Slack, Discord, or enterprise SIEMs',
        engine: 'FastAPI Webhooks',
        launchHref: '/solutions#surface',
        badge: 'Webhooks',
      },
    ],
    breakdown: {
      heading: 'API Integration Specifications',
      points: [
        {
          title: 'Asynchronous Job Dispatch',
          description:
            'POST /api/scans/new initiates a non-blocking background assessment, returning an immediate scan_id UUID for tracking.',
        },
        {
          title: 'Live WebSocket Log Streaming',
          description:
            'Connect to ws://localhost:8000/api/scans/{id}/ws to stream live stdout, engine progress percentages, and newly discovered vulnerabilities.',
        },
        {
          title: 'PDF & JSON Result Endpoints',
          description:
            'GET /api/scans/{id}/report returns cryptographic SHA-256 stamped executive PDF or structured JSON telemetry packages.',
        },
      ],
    },
    telemetryCard: {
      label: 'FastAPI OpenAPI Telemetry',
      status: 'OpenAPI 3.0 Ready • Swagger Live',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      logs: [
        '➜ Backend Engine: FastAPI 0.115 + Uvicorn Asyncio running on :8000',
        '➜ Swagger UI: http://localhost:8000/docs (Authenticated)',
        '➜ Schemas: Pydantic V2 ScanRequest, ScanResponse, FindingItem',
        '➜ Webhook Dispatch: Ready for Slack & SIEM integration',
      ],
    },
    supportedTags: ['FastAPI', 'OpenAPI 3.0', 'Swagger UI', 'WebSockets', 'Pydantic V2'],
    ctaLabel: 'Open Swagger Docs',
    ctaHref: 'http://localhost:8000/docs',
  },
  {
    id: 'devsecops',
    badge: 'SHIFT-LEFT SECURITY',
    title: 'DevSecOps & CI/CD Pipeline Kit',
    subtitle: 'Automated Security Gates for GitHub Actions & GitLab CI',
    description:
      'Automate dynamic security testing on every pull request. Catch zero-days and critical misconfigurations before production deployment with drop-in workflow recipes and SARIF exports.',
    accentColor: 'text-sky-400',
    accentBorder: 'border-sky-500/30',
    accentBg: 'bg-sky-500/10',
    accentHoverGlow: 'hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.18)]',
    icon: <GitMergeIcon className="w-8 h-8 text-sky-400" />,
    detailTools: [
      {
        name: 'GitHub Actions Workflow',
        role: '.github/workflows/security-scan.yml template with automated PR status comments',
        engine: 'GitHub Actions',
        launchHref: '/solutions#devsecops',
        badge: 'GH Actions',
      },
      {
        name: 'GitLab CI/CD Component',
        role: '.gitlab-ci.yml integration with custom containerized security stages',
        engine: 'GitLab CI',
        launchHref: '/solutions#devsecops',
        badge: 'GitLab CI',
      },
      {
        name: 'PR Blocker Quality Gate',
        role: 'Halts pull request merges automatically if findings exceed configured CVSS thresholds',
        engine: 'PR Gate',
        launchHref: '/solutions#devsecops',
        badge: 'PR Blocker',
      },
      {
        name: 'SARIF Report Exporter',
        role: 'Standardized Static Analysis Results Interchange Format for GitHub Security tab integration',
        engine: 'SARIF 2.1.0',
        launchHref: '/solutions#devsecops',
        badge: 'SARIF Format',
      },
    ],
    breakdown: {
      heading: 'CI/CD Pipeline Integration Architecture',
      points: [
        {
          title: 'Zero-Friction GitHub Integration',
          description:
            'Runs automatically on pull_request events, analyzing ephemeral preview deployments before production merges.',
        },
        {
          title: 'Customizable CVSS Thresholds',
          description:
            'Configure pass/fail conditions: allow informational warnings while strictly blocking high and critical severities.',
        },
        {
          title: 'In-Line PR Vulnerability Annotations',
          description:
            'Posts inline markdown comments on offending pull request lines with remediation blueprints and curl proofs.',
        },
      ],
    },
    telemetryCard: {
      label: 'DevSecOps CI/CD Status',
      status: 'Pipeline Gate Active • 0 Blockers',
      statusColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      logs: [
        '➜ Pipeline: GitHub Actions #142 (Workflow: security-scan.yml)',
        '➜ Target: Ephemeral Staging URL (https://pr-42.preview.app)',
        '➜ Policy: Pass threshold CVSS < 7.0 (High Severity Gate)',
        '➜ Result: 0 Critical / 0 High flaws found. PR Check Passed.',
      ],
    },
    supportedTags: ['GitHub Actions', 'GitLab CI', 'PR Blocker', 'SARIF Format', 'DevSecOps'],
    ctaLabel: 'View CI/CD Solutions',
    ctaHref: '/solutions#devsecops',
  },
  {
    id: 'remediation',
    badge: 'REMEDIATION KNOWLEDGE BASE',
    title: 'Remediation Knowledge Base & Code Fixes',
    subtitle: 'Drop-In Code Fixes, cURL PoC Recipes & Patch Blueprints',
    description:
      'Actionable developer remediation guides providing copy-paste code patches in Python, Go, Node.js, and SQL, accompanied by exact cURL commands to verify bug elimination and prevent regressions.',
    accentColor: 'text-rose-400',
    accentBorder: 'border-rose-500/30',
    accentBg: 'bg-rose-500/10',
    accentHoverGlow: 'hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.18)]',
    icon: <FileCodeIcon className="w-8 h-8 text-rose-400" />,
    detailTools: [
      {
        name: 'Multi-Language Code Fixes',
        role: 'Drop-in parameterized query and escaping patches in Python, Go, TypeScript, and PHP',
        engine: 'Patch Engine',
        launchHref: '/dashboard/reports',
        badge: 'Code Fixes',
      },
      {
        name: 'Verifiable cURL PoCs',
        role: 'Benign exploit reproduction curl commands to reproduce and confirm issue resolution',
        engine: 'PoC Generator',
        launchHref: '/dashboard/reports',
        badge: 'cURL PoC',
      },
      {
        name: 'MITRE CWE Fix Blueprints',
        role: 'Standardized architectural design patterns to prevent vulnerability re-introduction',
        engine: 'MITRE Fixes',
        launchHref: '/about#taxonomy',
        badge: 'CWE Blueprints',
      },
      {
        name: 'Patch Verification Engine',
        role: 'One-click targeted re-scan against individual finding to verify fix effectiveness',
        engine: 'Re-Scan Core',
        launchHref: '/dashboard/scans/new',
        badge: 'Re-Scan',
      },
    ],
    breakdown: {
      heading: 'Remediation Knowledge Specifications',
      points: [
        {
          title: 'Drop-In Parameterized Code Snippets',
          description:
            'Replaces string concatenation with prepared statements in SQL, context-aware encoding in HTML/JS, and strict regex for paths.',
        },
        {
          title: 'Reproducible Verification Recipes',
          description:
            'Every fix guide includes the exact curl command needed to verify that the vulnerability has been closed.',
        },
        {
          title: 'Gemini AI Intelligent Patch Assistant',
          description:
            'Ask our persistent Gemini AI Security Advisor for custom refactoring assistance tailored to your specific framework.',
        },
      ],
    },
    telemetryCard: {
      label: 'Remediation Blueprint Status',
      status: 'Patches Verified • Exploit PoC Ready',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      logs: [
        '➜ Flaw: CWE-89 (SQL Injection) in /api/v1/auth/login',
        '➜ Fix: Parameterized query patch generated for SQLAlchemy & psycopg2',
        '➜ Verification: curl -X POST -d "user=\' OR 1=1--" returns HTTP 400 Bad Request',
        '➜ Status: Verified Remediated • Zero Regressions',
      ],
    },
    supportedTags: ['Remediation Code', 'SQLi Fixes', 'XSS Sanitization', 'cURL PoC', 'Patch Verification'],
    ctaLabel: 'Consult Gemini AI Advisor',
    ctaHref: '/about',
  },
];

/* ─── Main Component ───────────────────────────────────────────────────────── */
export function ResourcesSection() {
  const [selectedResourceId, setSelectedResourceId] = useState<string>('taxonomy');

  const activeResource =
    RESOURCES_DATA.find((r) => r.id === selectedResourceId) || RESOURCES_DATA[0];

  return (
    <section className="py-20 bg-[#090D16] text-white w-full max-w-full">
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20">

        {/* ─── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center w-full max-w-full mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            ETHIOVULN DEVELOPER RESOURCES
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-normal leading-relaxed mb-6">
            Security Resources &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
              Developer Knowledge Base
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed tracking-normal max-w-4xl mx-auto">
            Vulnerability taxonomy guides, headless CLI scanner documentation, OWASP Top 10 coverage matrices, interactive FastAPI documentation, and drop-in remediation blueprints.
          </p>
        </div>

        {/* ─── Resource Selector Tab Switcher ─────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 w-full max-w-full">
          {RESOURCES_DATA.map((resource) => {
            const isSelected = resource.id === selectedResourceId;
            return (
              <button
                key={resource.id}
                type="button"
                onClick={() => setSelectedResourceId(resource.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? `${resource.accentBg} ${resource.accentBorder} shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400/40`
                    : 'bg-[#101628]/80 hover:bg-[#162035] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="mb-2">{resource.icon}</div>
                <span
                  className={`text-xs sm:text-sm font-bold tracking-normal leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {resource.title.replace(' Documentation', '').replace(' Knowledge Base', '')}
                </span>
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    isSelected ? resource.accentColor : 'text-slate-500'
                  }`}
                >
                  {resource.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── Active Resource Detail Card ─────────────────────────────────── */}
        <div
          className={`w-full max-w-full rounded-3xl bg-[#101628] border ${activeResource.accentBorder} p-6 sm:p-10 lg:p-12 transition-all relative overflow-hidden shadow-2xl`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Banner Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span
                  className={`text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-full ${activeResource.accentBg} ${activeResource.accentBorder} ${activeResource.accentColor} border`}
                >
                  {activeResource.badge}
                </span>
                {activeResource.popular && (
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    CORE STANDARD
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-normal leading-relaxed">
                {activeResource.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium tracking-normal leading-relaxed">
                {activeResource.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={activeResource.ctaHref}
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-sky-500 !text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{activeResource.ctaLabel}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Description Paragraph */}
          <div className="py-6">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed tracking-normal max-w-5xl">
              {activeResource.description}
            </p>
          </div>

          {/* ─── Integrated Resource Tools (One-By-One Breakdown) ──────────── */}
          <div className="mt-4 mb-8">
            <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-normal flex items-center gap-2">
                  <span className="text-cyan-400">⚙</span> Integrated Technical Modules & Specifications
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 tracking-normal">
                  Standardized developer toolkits, CLI commands, and automated compliance blueprints.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline-block">
                {activeResource.detailTools.length} Standardized Modules
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeResource.detailTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0b101c] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {tool.engine}
                      </span>
                      {tool.badge && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1.5 leading-snug">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {tool.role}
                    </p>
                  </div>

                  <Link
                    href={tool.launchHref}
                    className="inline-flex items-center justify-between text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors pt-2 border-t border-slate-800/60"
                  >
                    <span>Explore Component</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Breakdown Specifications & Telemetry Card ─────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            {/* Left Breakdown Specifications */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-normal mb-2">
                {activeResource.breakdown.heading}
              </h3>
              <div className="space-y-3.5">
                {activeResource.breakdown.points.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0d1424] border border-slate-800/80"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg ${activeResource.accentBg} ${activeResource.accentColor} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <CheckmarkIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug mb-1">
                        {pt.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {pt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Telemetry Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#080c14] border border-slate-800 shadow-xl font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-slate-300">
                      {activeResource.telemetryCard.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${activeResource.telemetryCard.statusColor}`}
                  >
                    SPEC STATUS
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3">
                  {activeResource.telemetryCard.status}
                </div>

                <div className="space-y-2 bg-[#05080f] p-3 rounded-xl border border-slate-900 text-slate-300 text-[11px] leading-relaxed">
                  {activeResource.telemetryCard.logs.map((log, lIdx) => (
                    <div key={lIdx} className="font-mono text-cyan-300/90">
                      {log}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {activeResource.supportedTags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
