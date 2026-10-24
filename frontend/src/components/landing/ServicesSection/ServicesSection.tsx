'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── Self-Contained SVG Service Icons ────────────────────────────────────── */
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

function FileTextIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function GaugeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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
export interface ServiceTool {
  name: string;
  role: string;
  engine: string;
  launchHref: string;
  badge?: string;
}

export interface ServiceDetail {
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
  detailTools: ServiceTool[];
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

/* ─── Services Data (One-By-One Detailed Tool Mapping) ───────────────────────── */
export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'dast',
    badge: 'AUTOMATED CLOUD DAST',
    popular: true,
    title: 'Automated DAST Assessment Service',
    subtitle: 'Autonomous Multi-Tier Web Application Security Auditing',
    description:
      'Continuous asynchronous dynamic security testing engineered for modern SPAs, microservices, and web applications. Detects SQLi, XSS, SSRF, command injection, and 75+ vulnerability vectors in record time.',
    accentColor: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentBg: 'bg-cyan-500/10',
    accentHoverGlow: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.18)]',
    icon: <SpiderBugIcon className="w-8 h-8 text-cyan-400" />,
    detailTools: [
      {
        name: 'Website Vulnerability Scanner',
        role: 'Autonomous web app crawling, DOM execution, and active parameter fuzzing',
        engine: 'Core DAST',
        launchHref: '/dashboard/scans/new?mode=deep',
        badge: 'Core Tool',
      },
      {
        name: 'Nuclei Template Engine',
        role: '8,000+ community-verified YAML rules matching CVEs and zero-day signatures',
        engine: 'Go Async IO',
        launchHref: '/dashboard/scans/new?engine=nuclei',
        badge: '8k Rules',
      },
      {
        name: 'OWASP ZAP Dynamic Spider',
        role: 'Deep headless session spider, AJAX form submission & active crawler',
        engine: 'OWASP ZAP 2.14',
        launchHref: '/dashboard/scans/new?engine=zap',
        badge: 'OWASP',
      },
      {
        name: 'Smart Discovery Fuzzer',
        role: 'Fast multi-threaded discovery of unlinked endpoints, .env leaks, and source paths',
        engine: 'FastAPI Async Fuzz',
        launchHref: '/dashboard/scans/new?engine=fuzzer',
        badge: 'API & Files',
      },
    ],
    breakdown: {
      heading: 'DAST Operational Capabilities',
      points: [
        {
          title: 'Deep Multi-Engine Dynamic Pipeline',
          description:
            'Combines custom HTTP inoculators with Nuclei and OWASP ZAP to eliminate blind spots across client and server-side execution paths.',
        },
        {
          title: 'Zero-Trust Anti-SSRF Pre-Flight Gateway',
          description:
            'Enforces real-time DNS resolution checks, blocking RFC 1918 subnets, cloud metadata (169.254.169.254), and local loopbacks before initiating scans.',
        },
        {
          title: 'Reproducible Exploit Proofs',
          description:
            'Every valid finding produces verifiable curl commands and HTTP payload traces for rapid engineering remediation.',
        },
      ],
    },
    telemetryCard: {
      label: 'Automated DAST Status',
      status: 'Pipeline Active • Zero Manual Agents',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      logs: [
        '➜ Target: https://target-app.com (Status: HTTP 200 OK)',
        '➜ Nuclei Engine: 8,420 YAML rules executed across endpoints',
        '➜ OWASP ZAP: Active dynamic spider discovered 142 unique routes',
        '➜ Result: 0 False Positives, Verified CVSS Base Vector Generated',
      ],
    },
    supportedTags: ['OWASP Top 10', 'SQLi / XSS / SSRF', 'Nuclei YAML', 'OWASP ZAP', 'Reproducible PoC'],
    ctaLabel: 'Launch DAST Assessment',
    ctaHref: '/dashboard/scans/new?mode=deep',
  },
  {
    id: 'reporting',
    badge: 'EXECUTIVE & DEV REPORTING',
    title: 'Executive PDF & Compliance Reporting',
    subtitle: 'Audit-Grade Documentation & Remediation Blueprints',
    description:
      'Generate boardroom-ready executive summaries alongside developer-level reproduction blueprints with a single click. Cryptographically signed with SHA-256 for audit immutability.',
    accentColor: 'text-rose-400',
    accentBorder: 'border-rose-500/30',
    accentBg: 'bg-rose-500/10',
    accentHoverGlow: 'hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.18)]',
    icon: <FileTextIcon className="w-8 h-8 text-rose-400" />,
    detailTools: [
      {
        name: 'ReportLab PDF Generator',
        role: 'High-resolution vector PDF rendering with color-coded risk distribution matrices',
        engine: 'ReportLab 4.x',
        launchHref: '/dashboard/reports',
        badge: 'Vector PDF',
      },
      {
        name: 'Executive Posture Gauge',
        role: 'High-level security posture summary, risk index, and board-level risk scoring',
        engine: 'Executive Suite',
        launchHref: '/dashboard/reports',
        badge: 'Board-Ready',
      },
      {
        name: 'Developer cURL Blueprint Engine',
        role: 'Precise curl commands, HTTP response headers, and exact reproduction recipes',
        engine: 'DevSecOps',
        launchHref: '/dashboard/reports',
        badge: 'Dev Blueprint',
      },
      {
        name: 'SHA-256 Audit Stamp',
        role: 'Cryptographic tamper-proofing ensuring report immutability for compliance officers',
        engine: 'Crypto Audit',
        launchHref: '/dashboard/reports',
        badge: 'Audit Seal',
      },
    ],
    breakdown: {
      heading: 'Reporting & Compliance Specifications',
      points: [
        {
          title: 'Dual-Audience Architecture',
          description:
            'Delivers high-level executive posture summaries for leadership, while embedding full HTTP payloads and fix steps for software developers.',
        },
        {
          title: 'Regulatory & Standard Cross-Referencing',
          description:
            'Every finding maps directly to OWASP Top 10 2021 categories, ISO 27001 controls, and MITRE CWE references.',
        },
        {
          title: 'Cryptographic Integrity Stamping',
          description:
            'Every exported PDF receives an indelible SHA-256 hash stamp, verifying report authenticity for external auditors and enterprise procurement.',
        },
      ],
    },
    telemetryCard: {
      label: 'Executive PDF Telemetry',
      status: 'SHA-256 Verified • Audit Sealed',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      logs: [
        '➜ PDF Engine: ReportLab 4.4 high-dpi vector canvas compiled',
        '➜ Hash: 8f4b23c901e... (SHA-256 Audit Stamp Applied)',
        '➜ Sections: Executive Summary, CVSS Matrix, Developer PoC Guides',
        '➜ Export: 1-Click Instant Download Ready',
      ],
    },
    supportedTags: ['PDF Export', 'SHA-256 Hash', 'Executive Summary', 'Developer PoC', 'ISO 27001 / SOC 2'],
    ctaLabel: 'View Sample Reports',
    ctaHref: '/dashboard/reports',
  },
  {
    id: 'cvss',
    badge: 'CVSS v3.1 & MITRE CWE',
    title: 'CVSS v3.1 Scoring & Risk Analysis',
    subtitle: 'Scientific Quantitative Vulnerability Prioritization',
    description:
      'Standardized CVSS v3.1 base vector scoring (Attack Vector, Complexity, Privileges, Scope, Impact) coupled with contextual temporal metric calculations and explicit MITRE CWE cross-mapping.',
    accentColor: 'text-orange-400',
    accentBorder: 'border-orange-500/30',
    accentBg: 'bg-orange-500/10',
    accentHoverGlow: 'hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.18)]',
    icon: <GaugeIcon className="w-8 h-8 text-orange-400" />,
    detailTools: [
      {
        name: 'CVSS v3.1 Base Vector Engine',
        role: 'Computes exact 0.0 - 10.0 severity scores based on standardized FIRST.org algorithms',
        engine: 'CVSS v3.1 Core',
        launchHref: '/about#taxonomy',
        badge: 'FIRST.org',
      },
      {
        name: 'Temporal Metric Matrix',
        role: 'Dynamically scales risk scores based on exploit code maturity and remediation availability',
        engine: 'Risk Analysis',
        launchHref: '/about#taxonomy',
        badge: 'Temporal',
      },
      {
        name: 'MITRE CWE-2024 Mapper',
        role: 'Maps vulnerabilities to standardized weakness enumerations (e.g., CWE-89, CWE-79, CWE-918)',
        engine: 'MITRE Taxonomy',
        launchHref: '/about#taxonomy',
        badge: 'CWE-2024',
      },
      {
        name: 'Risk Heatmap Visualizer',
        role: 'Interactive multi-asset matrix revealing aggregate vulnerability posture and exposure velocity',
        engine: 'Visual Posture',
        launchHref: '/about#taxonomy',
        badge: 'Heatmap',
      },
    ],
    breakdown: {
      heading: 'Scientific Risk Classification Architecture',
      points: [
        {
          title: 'Algorithmic Severity Computation',
          description:
            'Calculates exact sub-scores for Exploitability (AV, AC, PR, UI) and Impact (Confidentiality, Integrity, Availability) according to FIRST CVSS v3.1 specs.',
        },
        {
          title: 'Deduplicated Risk Aggregation',
          description:
            'Automatically merges matching findings across multiple scanners into a single canonical issue with correlated exploit confidence.',
        },
        {
          title: 'Prioritized Remediation Ranking',
          description:
            'Ranks fixes by actionable impact so development teams address the most hazardous flaws first.',
        },
      ],
    },
    telemetryCard: {
      label: 'CVSS v3.1 Scoring Telemetry',
      status: 'Vectors Calibrated • MITRE Linked',
      statusColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      logs: [
        '➜ Finding: SQL Injection in /api/v1/auth/login',
        '➜ Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        '➜ Base Score: 9.8 (CRITICAL) • MITRE CWE-89 Linked',
        '➜ Temporal: Exploit Proof Confirmed • Remediation Required',
      ],
    },
    supportedTags: ['CVSS v3.1', 'MITRE CWE', 'Quantitative Scoring', 'Risk Heatmap', 'Exploit Prioritization'],
    ctaLabel: 'Explore CVSS Taxonomy',
    ctaHref: '/about#taxonomy',
  },
  {
    id: 'network',
    badge: 'PERIMETER AUDITING',
    title: 'Network & Port Perimeter Auditing',
    subtitle: 'Host Discovery, SYN Port Scans & TLS Cryptographic Verification',
    description:
      'High-speed external infrastructure assessment for cloud endpoints, virtual machines, and public IPs. Audits open network ports, analyzes daemon banners, and tests TLS cipher suites.',
    accentColor: 'text-emerald-400',
    accentBorder: 'border-emerald-500/30',
    accentBg: 'bg-emerald-500/10',
    accentHoverGlow: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]',
    icon: <NetworkNodesIcon className="w-8 h-8 text-emerald-400" />,
    detailTools: [
      {
        name: 'Fast SYN Port Scanner',
        role: 'Non-disruptive asynchronous port mapping across top 1,000 enterprise network ports',
        engine: 'TCP/UDP Engine',
        launchHref: '/dashboard/scans/new?type=port',
        badge: 'Fast SYN',
      },
      {
        name: 'SSL/TLS Cipher Suite Auditor',
        role: 'Verifies TLS 1.3 enforcement, flags weak ciphers (RC4, 3DES), and audits certificates',
        engine: 'TLS Inspector',
        launchHref: '/dashboard/scans/new?type=ssl',
        badge: 'TLS 1.3',
      },
      {
        name: 'Daemon Banner Grabber',
        role: 'Fingerprints web servers, SSH, and database versions to identify unpatched software',
        engine: 'Banner Scanner',
        launchHref: '/dashboard/scans/new?type=network',
        badge: 'Fingerprint',
      },
      {
        name: 'DNS Zone & Subdomain Prober',
        role: 'Detects dangling DNS records, zone misconfigurations, and subdomain takeover risks',
        engine: 'DNS Gateway',
        launchHref: '/dashboard/scans/new?type=dns',
        badge: 'DNS Zone',
      },
    ],
    breakdown: {
      heading: 'Network Infrastructure Architecture',
      points: [
        {
          title: 'High-Concurrency Non-Disruptive Scans',
          description:
            'Employs intelligent rate limiting and connection pooling to survey open ports without triggering service disruptions or excessive firewall drops.',
        },
        {
          title: 'TLS/SSL Cryptographic Inspection',
          description:
            'Verifies certificate expiration, intermediate chain completeness, forward secrecy, and HSTS headers to ensure secure data-in-transit.',
        },
        {
          title: 'Exposed Management Interface Detection',
          description:
            'Flags unintended internet-facing ports such as Redis, MongoDB, RDP, and SSH, minimizing unauthorized access attack vectors.',
        },
      ],
    },
    telemetryCard: {
      label: 'Network Perimeter Telemetry',
      status: 'Perimeter Audited • 0 Weak Ciphers',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      logs: [
        '➜ Host: 198.51.100.42 (Active SYN Port Scan Completed)',
        '➜ Ports: 80 (HTTP Redirect), 443 (TLS 1.3 OK), 22 (SSH OpenSSH 9.2)',
        '➜ Weak Ciphers: 0 detected (Strict ECDHE-RSA-AES256 enforced)',
        '➜ DNS Records: No dangling CNAME or takeover vector found',
      ],
    },
    supportedTags: ['Port Scanner', 'TLS 1.3', 'HSTS Enforced', 'Banner Grabbing', 'DNS Auditing'],
    ctaLabel: 'Audit Network Perimeter',
    ctaHref: '/dashboard/scans/new?type=network',
  },
  {
    id: 'api',
    badge: 'API SECURITY & SECRETS',
    title: 'API & Cloud Secrets Vulnerability Audit',
    subtitle: 'OWASP API Top 10, GraphQL Probes & Cloud Exposure Hunting',
    description:
      'Autonomous auditing engineered specifically for RESTful, GraphQL, and microservice APIs. Uncovers broken object-level authorization (BOLA), exposed API secrets, and cloud storage leaks.',
    accentColor: 'text-purple-400',
    accentBorder: 'border-purple-500/30',
    accentBg: 'bg-purple-500/10',
    accentHoverGlow: 'hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]',
    icon: <ApiCloudIcon className="w-8 h-8 text-purple-400" />,
    detailTools: [
      {
        name: 'REST API Parameter Fuzzer',
        role: 'Automated fuzzing across multipart forms, query params, and deeply nested JSON bodies',
        engine: 'FastAPI Fuzzer',
        launchHref: '/dashboard/scans/new?type=api',
        badge: 'REST Fuzz',
      },
      {
        name: 'GraphQL Schema Introspector',
        role: 'Detects unauthorized introspection queries, circular query DOS, and hidden mutations',
        engine: 'GraphQL Core',
        launchHref: '/dashboard/scans/new?type=graphql',
        badge: 'GraphQL',
      },
      {
        name: 'Cloud Storage Bucket Prober',
        role: 'Audits public AWS S3, Azure Blob, and GCP storage buckets for unauthorized read/write access',
        engine: 'Cloud Probe',
        launchHref: '/dashboard/scans/new?type=cloud',
        badge: 'S3 / Blobs',
      },
      {
        name: 'Sensitive Secret Scanner',
        role: 'Detects leaked .env files, private keys, AWS access tokens, and exposed Git repositories',
        engine: 'Secret Scanner',
        launchHref: '/dashboard/scans/new?type=secrets',
        badge: 'Token Leak',
      },
    ],
    breakdown: {
      heading: 'API & Cloud Security Architecture',
      points: [
        {
          title: 'OWASP API Top 10 Coverage',
          description:
            'Dedicated probes for broken object-level authorization, lack of resources & rate limiting, security misconfiguration, and mass assignment.',
        },
        {
          title: 'Zero-Knowledge Secret Detection',
          description:
            'Combines entropy calculations with pattern-matching heuristics to identify high-entropy strings and credentials before malicious actors can scrape them.',
        },
        {
          title: 'Cloud Object Permission Auditing',
          description:
            'Probes public bucket endpoints to verify strict ACL policies and block accidental public data disclosures.',
        },
      ],
    },
    telemetryCard: {
      label: 'API & Secrets Telemetry',
      status: 'API Surface Guarded • No Tokens Leaked',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      logs: [
        '➜ REST Endpoints: 78 tested for injection & parameter tampering',
        '➜ GraphQL: Introspection disabled on production endpoint',
        '➜ Storage: S3 buckets audited — AccessControlPolicy: Strict Private',
        '➜ Secrets: .env and .git paths verified 404 blocked',
      ],
    },
    supportedTags: ['OWASP API Top 10', 'BOLA / IDOR', 'GraphQL Probe', 'S3 Bucket Probe', 'Secret Detection'],
    ctaLabel: 'Scan API & Secrets',
    ctaHref: '/dashboard/scans/new?type=api',
  },
  {
    id: 'asm',
    badge: 'ATTACK SURFACE MANAGEMENT',
    title: 'Continuous Attack Surface Monitoring (ASM)',
    subtitle: 'Automated Asset Mapping, Shadow IT Detection & Webhook Alerting',
    description:
      'Continuous external asset discovery and perimeter inventory. Monitors your complete digital footprint, detects shadow IT deployments, and broadcasts real-time alerts via Webhooks and Slack.',
    accentColor: 'text-teal-400',
    accentBorder: 'border-teal-500/30',
    accentBg: 'bg-teal-500/10',
    accentHoverGlow: 'hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.18)]',
    icon: <RadarGlobeIcon className="w-8 h-8 text-teal-400" />,
    detailTools: [
      {
        name: 'Subdomain Reconnaissance Engine',
        role: 'Passive and active subdomain discovery leveraging Certificate Transparency logs and DNS brute-forcing',
        engine: 'Recon Core',
        launchHref: '/solutions#surface',
        badge: 'Subdomain',
      },
      {
        name: 'Asset Drift Detector',
        role: 'Monitors perimeter changes, detecting new hosts, modified IP allocations, and shadow deployments',
        engine: 'Drift Monitor',
        launchHref: '/solutions#surface',
        badge: 'Asset Drift',
      },
      {
        name: 'Perimeter Inventory Catalog',
        role: 'Unified registry of public-facing domains, IP addresses, web applications, and SSL certificates',
        engine: 'Inventory Bus',
        launchHref: '/solutions#surface',
        badge: 'Inventory',
      },
      {
        name: 'Slack & Webhook Alert Bus',
        role: 'Instant high-priority dispatch to SecOps teams when critical new exposures are discovered',
        engine: 'Webhook Bus',
        launchHref: '/solutions#surface',
        badge: 'Slack Alert',
      },
    ],
    breakdown: {
      heading: 'Continuous Attack Surface Capabilities',
      points: [
        {
          title: 'Certificate Transparency Mining',
          description:
            'Captures newly issued SSL certificates in near real-time to uncover staging domains and unlinked customer portals before attackers do.',
        },
        {
          title: 'Continuous Perimeter Baseline Tracking',
          description:
            'Establishes a baseline of all public endpoints, instantly flagging abnormal configuration drift or accidental cloud service exposures.',
        },
        {
          title: 'Automated Escalation Workflows',
          description:
            'Integrates with developer webhooks, Slack channels, and PagerDuty to route verified critical flaws directly to responsible engineers.',
        },
      ],
    },
    telemetryCard: {
      label: 'Attack Surface Telemetry',
      status: 'Continuous Monitoring Active',
      statusColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      logs: [
        '➜ Footprint: 26 Verified Domains & Subdomains Mapped',
        '➜ Certificate Logs: Real-time CT stream synchronized',
        '➜ Drift Check: 0 unmanaged shadow assets detected',
        '➜ Webhook Dispatch: Slack Channel #secops-alerts connected',
      ],
    },
    supportedTags: ['Attack Surface', 'Shadow IT', 'Subdomain Recon', 'Webhook Alerts', 'Certificate Logs'],
    ctaLabel: 'Activate Attack Surface Monitor',
    ctaHref: '/solutions#surface',
  },
];

/* ─── Main Component ───────────────────────────────────────────────────────── */
export function ServicesSection() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('dast');

  const activeService =
    SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  return (
    <section className="py-20 bg-[#090D16] text-white w-full max-w-full">
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20">

        {/* ─── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center w-full max-w-full mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            ETHIOVULN SECURITY CAPABILITIES
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-normal leading-relaxed mb-6">
            Enterprise Pentesting &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
              Assessment Services
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed tracking-normal max-w-4xl mx-auto">
            Full-spectrum dynamic security testing, continuous compliance auditing, and threat analysis powered by industry-standard engines with one-by-one integrated tool breakdowns.
          </p>
        </div>

        {/* ─── Service Selector Tab Switcher ──────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 w-full max-w-full">
          {SERVICES_DATA.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedServiceId(service.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                  isSelected
                    ? `${service.accentBg} ${service.accentBorder} shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400/40`
                    : 'bg-[#101628]/80 hover:bg-[#162035] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="mb-2">{service.icon}</div>
                <span
                  className={`text-xs sm:text-sm font-bold tracking-normal leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {service.title.replace(' Service', '').replace(' Engine', '')}
                </span>
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    isSelected ? service.accentColor : 'text-slate-500'
                  }`}
                >
                  {service.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── Active Service Detail Card ─────────────────────────────────── */}
        <div
          className={`w-full max-w-full rounded-3xl bg-[#101628] border ${activeService.accentBorder} p-6 sm:p-10 lg:p-12 transition-all relative overflow-hidden shadow-2xl`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Banner Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span
                  className={`text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-full ${activeService.accentBg} ${activeService.accentBorder} ${activeService.accentColor} border`}
                >
                  {activeService.badge}
                </span>
                {activeService.popular && (
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    MOST REQUESTED
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-normal leading-relaxed">
                {activeService.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium tracking-normal leading-relaxed">
                {activeService.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={activeService.ctaHref}
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-sky-500 !text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{activeService.ctaLabel}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Description Paragraph */}
          <div className="py-6">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed tracking-normal max-w-5xl">
              {activeService.description}
            </p>
          </div>

          {/* ─── Integrated Service Tools (One-By-One Breakdown) ───────────── */}
          <div className="mt-4 mb-8">
            <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-800/80">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-normal flex items-center gap-2">
                  <span className="text-cyan-400">⚙</span> Integrated Service Tools (One-By-One Breakdown)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 tracking-normal">
                  Each tool runs synchronously or through coordinated background job queues with verified output.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline-block">
                {activeService.detailTools.length} Standardized Modules
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeService.detailTools.map((tool, idx) => (
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
                    <span>Launch Tool</span>
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
                {activeService.breakdown.heading}
              </h3>
              <div className="space-y-3.5">
                {activeService.breakdown.points.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0d1424] border border-slate-800/80"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg ${activeService.accentBg} ${activeService.accentColor} flex items-center justify-center shrink-0 mt-0.5`}
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
                      {activeService.telemetryCard.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${activeService.telemetryCard.statusColor}`}
                  >
                    LIVE STATUS
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3">
                  {activeService.telemetryCard.status}
                </div>

                <div className="space-y-2 bg-[#05080f] p-3 rounded-xl border border-slate-900 text-slate-300 text-[11px] leading-relaxed">
                  {activeService.telemetryCard.logs.map((log, lIdx) => (
                    <div key={lIdx} className="font-mono text-cyan-300/90">
                      {log}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {activeService.supportedTags.map((tag, tIdx) => (
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
