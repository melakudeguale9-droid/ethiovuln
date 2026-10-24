'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Inline Self-Contained SVG Icons ──────────────────────────────────────── */
function MegaphoneIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

import { ThemeToggle } from '@/components/ui/ThemeToggle';

/* ─── Navigation Dropdown Data ──────────────────────────────────────────────── */
interface NavDropdownItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
  iconType?: string;
  detailTools?: string[];
}

function DropdownIcon({ type }: { type?: string }) {
  switch (type) {
    case 'radar':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 dark:border-cyan-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 12 21.5 2.5" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      );
    case 'zap':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 dark:border-amber-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      );
    case 'spider':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="8" height="14" x="8" y="5" rx="4" />
            <path d="m19 5-3 3" /><path d="m5 5 3 3" /><path d="m19 19-3-3" /><path d="m5 19 3-3" />
            <path d="M2 12h4" /><path d="M18 12h4" />
          </svg>
        </div>
      );
    case 'fuzzer':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25 dark:border-purple-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
          </svg>
        </div>
      );
    case 'devops':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25 dark:border-sky-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      );
    case 'compliance':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 dark:border-indigo-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      );
    case 'globe':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/25 dark:border-teal-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
      );
    case 'report':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 dark:border-rose-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
      );
    case 'cvss':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25 dark:border-orange-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
      );
    case 'terminal':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </div>
      );
    case 'info':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 dark:border-blue-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
      );
    case 'user':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25 dark:border-violet-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      );
    case 'book':
    default:
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 dark:bg-slate-500/15 text-slate-600 dark:text-slate-300 border border-slate-500/25 dark:border-slate-500/30 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" /><path d="M6 10h10" />
          </svg>
        </div>
      );
  }
}

interface NavSection {
  label: string;
  hasDropdown: boolean;
  href?: string;
  items?: NavDropdownItem[];
}

const NAV_MENU: NavSection[] = [
  {
    label: 'Product',
    hasDropdown: true,
    items: [
      {
        title: 'Website Vulnerability Scanner',
        desc: 'Comprehensive DAST for SQLi, XSS, SSRF & CVEs',
        href: '/dashboard/scans/new?mode=deep',
        badge: 'Core DAST',
        iconType: 'radar',
        detailTools: ['Website Scanner', 'Payload Injector', 'SSRF Guard'],
      },
      {
        title: 'Nuclei Template Engine',
        desc: '8,000+ community verified YAML vulnerability rules',
        href: '/dashboard/scans/new?engine=nuclei',
        badge: '8k Rules',
        iconType: 'zap',
        detailTools: ['CVE-2024 Signatures', 'Misconfig Hunter', 'Zero-Day Templates'],
      },
      {
        title: 'OWASP ZAP Dynamic Spider',
        desc: 'Active crawler injection & deep session token analysis',
        href: '/dashboard/scans/new?engine=zap',
        badge: 'OWASP',
        iconType: 'spider',
        detailTools: ['Headless Crawler', 'Session Token Analyzer', 'Form Auto-Fuzzer'],
      },
      {
        title: 'Smart Discovery Fuzzer',
        desc: 'Sensitive endpoint, .env, and hidden file probing',
        href: '/dashboard/scans/new?engine=fuzzer',
        badge: 'API & Files',
        iconType: 'fuzzer',
        detailTools: ['Sensitive File Prober', 'Git/.env Exposure', 'Admin URL Hunter'],
      },
    ],
  },
  {
    label: 'Solutions',
    hasDropdown: true,
    items: [
      {
        title: 'Web Application Pentesting',
        desc: 'End-to-end active DAST & CVE verification for modern web apps',
        href: '/solutions#webapp',
        badge: 'Core DAST',
        iconType: 'radar',
        detailTools: ['Website Scanner', 'Nuclei YAML Engine', 'OWASP ZAP Spider'],
      },
      {
        title: 'Network & Infrastructure Security',
        desc: 'Perimeter host discovery, TCP/UDP port audits & SSL/TLS verification',
        href: '/solutions#network',
        badge: 'Infra',
        iconType: 'zap',
        detailTools: ['Network Scanner', 'Port Scanner (SYN)', 'TLS Cipher Auditor'],
      },
      {
        title: 'API & Cloud Perimeter Security',
        desc: 'OWASP API Top 10, GraphQL inspection & cloud storage leak checks',
        href: '/solutions#api',
        badge: 'API Top 10',
        iconType: 'fuzzer',
        detailTools: ['REST API Fuzzer', 'GraphQL Probe', 'S3/Cloud Leak Checker'],
      },
      {
        title: 'DevSecOps & CI/CD Pipelines',
        desc: 'Automated headless scans & security gates for GitHub Actions & GitLab',
        href: '/solutions#devsecops',
        badge: 'Shift-Left',
        iconType: 'devops',
        detailTools: ['Headless CLI Runner', 'PR Blocker Gate', 'Slack/Webhook Alerts'],
      },
      {
        title: 'Attack Surface Management (ASM)',
        desc: 'Continuous perimeter monitoring, shadow IT & subdomain discovery',
        href: '/solutions#surface',
        badge: 'Continuous',
        iconType: 'globe',
        detailTools: ['Subdomain Recon', 'DNS Zone Auditor', 'Hidden Endpoint Fuzzer'],
      },
      {
        title: 'SOC 2 & Compliance Auditing',
        desc: 'Continuous evidence collection, CVSS v3.1 & executive PDF reports',
        href: '/solutions#compliance',
        badge: 'Audit-Ready',
        iconType: 'compliance',
        detailTools: ['CVSS v3.1 Scoring', 'Executive PDF Generator', 'MITRE CWE Mapper'],
      },
    ],
  },
  {
    label: 'Pricing',
    hasDropdown: false,
    href: '/pricing',
  },
  {
    label: 'Services',
    hasDropdown: true,
    items: [
      {
        title: 'Automated DAST Assessment',
        desc: 'Continuous dynamic vulnerability scanning across full web stacks & OWASP Top 10',
        href: '/dashboard/scans/new?mode=deep',
        badge: 'Cloud DAST',
        iconType: 'radar',
        detailTools: ['Website Scanner', 'Nuclei YAML Engine', 'OWASP ZAP Spider'],
      },
      {
        title: 'Executive PDF Reporting',
        desc: 'One-click compliance, CVSS metrics, and developer remediation blueprints',
        href: '/dashboard/reports',
        badge: 'ISO & SOC2',
        iconType: 'report',
        detailTools: ['ReportLab Engine', 'Executive Posture Chart', 'SHA-256 Audit Stamp'],
      },
      {
        title: 'CVSS v3.1 Scoring Engine',
        desc: 'Standardized quantitative scoring, MITRE CWE mapping & threat prioritization',
        href: '/about#taxonomy',
        badge: 'CVSS v3.1',
        iconType: 'cvss',
        detailTools: ['CVSS v3.1 Scoring', 'Temporal Metric Matrix', 'MITRE CWE Mapper'],
      },
      {
        title: 'Network & Port Perimeter Auditing',
        desc: 'Perimeter host discovery, SYN port scans, service profiling & SSL/TLS verification',
        href: '/solutions#network',
        badge: 'Perimeter',
        iconType: 'zap',
        detailTools: ['Network Scanner', 'Fast SYN Port Scanner', 'TLS Cipher Auditor'],
      },
      {
        title: 'API & Cloud Secrets Audit',
        desc: 'Exposed credentials, REST parameter injections, GraphQL queries & cloud storage',
        href: '/solutions#api',
        badge: 'API Top 10',
        iconType: 'fuzzer',
        detailTools: ['REST API Fuzzer', 'GraphQL Schema Probe', 'Cloud Secret Scanner'],
      },
      {
        title: 'Continuous Attack Surface Management',
        desc: 'Automated external asset mapping, subdomain discovery & automated alerting',
        href: '/solutions#surface',
        badge: 'Continuous',
        iconType: 'globe',
        detailTools: ['Subdomain Recon', 'DNS Zone Auditor', 'Webhook Alert Bus'],
      },
    ],
  },
  {
    label: 'Company',
    hasDropdown: true,
    items: [
      {
        title: 'About EthioVuln & Mission',
        desc: 'Democratizing proactive cybersecurity intelligence and automated DAST standards',
        href: '/about',
        badge: 'Mission',
        iconType: 'info',
        detailTools: ['Continuous DAST', 'OWASP Standardization', 'Democratized Access'],
      },
      {
        title: 'Tri-Engine Architecture',
        desc: 'Distributed Celery & Redis orchestration across Nuclei, ZAP, and Smart Fuzzer',
        href: '/about#architecture',
        badge: 'Architecture',
        iconType: 'devops',
        detailTools: ['Celery Async Workers', 'Redis Event Bus', 'PostgreSQL Result Store'],
      },
      {
        title: 'Cyber Security Student & Research Profile',
        desc: 'Offensive exploit research, security engineering, and INSA cyber talent',
        href: '/about#developer',
        badge: 'Leadership',
        iconType: 'user',
        detailTools: ['Melaku Deguale', 'Cyber Security Student', 'INSA Cyber Center'],
      },
      {
        title: '8 Enterprise Assessment Vectors',
        desc: 'Taxonomy covering Injection, Broken Auth, Sensitive Exposure, SSRF & CVEs',
        href: '/about#vectors',
        badge: 'Taxonomy',
        iconType: 'radar',
        detailTools: ['OWASP Top 10', 'Anti-SSRF Gate', 'CVE Signatures'],
      },
      {
        title: 'Security Compliance & Policy',
        desc: 'Responsible disclosure guidelines, ethical testing standards & zero-trust boundaries',
        href: '/about#contact',
        badge: 'Policy',
        iconType: 'compliance',
        detailTools: ['Safe Harbor Policy', 'ISO 27001 Mapping', 'Zero-Trust Boundary'],
      },
      {
        title: 'Contact Security Operations',
        desc: 'Direct operational inquiries, vulnerability reporting, and enterprise support',
        href: 'mailto:security@ethiovuln.io',
        badge: 'Operations',
        iconType: 'globe',
        detailTools: ['24/7 Security Desk', 'Enterprise Support', 'Responsible Disclosure'],
      },
    ],
  },
  {
    label: 'Resources',
    hasDropdown: true,
    items: [
      {
        title: 'Vulnerability Taxonomy',
        desc: '8 standardized assessment tiers, MITRE CWE mapping & CVSS matrix',
        href: '/resources#taxonomy',
        badge: 'Taxonomy',
        iconType: 'book',
        detailTools: ['8 Assessment Tiers', 'CVSS v3.1 Matrix', 'MITRE CWE Mapper'],
      },
      {
        title: 'CLI Scanner Documentation',
        desc: 'Single-command headless scans, Docker container specs, and flags',
        href: '/resources#cli',
        badge: 'CLI Guide',
        iconType: 'terminal',
        detailTools: ['Headless CLI', 'Docker Daemon', 'Curl One-Liner'],
      },
      {
        title: 'OWASP Top 10 (2024) Matrix',
        desc: 'Coverage matrix for injection, SSRF, broken auth & access controls',
        href: '/resources#owasp',
        badge: 'OWASP 2024',
        iconType: 'compliance',
        detailTools: ['SQLi & XSS Rules', 'SSRF Neutralizer', 'JWT Token Analyzer'],
      },
      {
        title: 'FastAPI & REST Documentation',
        desc: 'Interactive OpenAPI/Swagger docs, JSON schemas & scan webhooks',
        href: '/resources#api',
        badge: 'REST API',
        iconType: 'fuzzer',
        detailTools: ['OpenAPI 3.0 / Swagger', 'Pydantic Schemas', 'Webhook Event Bus'],
      },
      {
        title: 'DevSecOps & CI/CD Pipeline Kit',
        desc: 'GitHub Actions, GitLab CI gates, and pull request blocker scripts',
        href: '/resources#devsecops',
        badge: 'Shift-Left',
        iconType: 'devops',
        detailTools: ['GitHub Actions YAML', 'GitLab CI Pipeline', 'PR Quality Gate'],
      },
      {
        title: 'Remediation Knowledge Base',
        desc: 'Drop-in code fixes, exploit proofs, and patch recipes for developers',
        href: '/resources#remediation',
        badge: 'Fix Guides',
        iconType: 'report',
        detailTools: ['Python/Go/Node Patches', 'cURL PoC Recipes', 'MITRE Fix Guides'],
      },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState<number>(115);

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current && !mobileMenuOpen) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [mobileMenuOpen]);

  return (
    <>
      <div ref={navRef} className="w-full fixed top-0 left-0 right-0 z-50">

      {/* ─── Top Notification Banner (Exact Pentest-Tools Vibrant Orange) ──── */}
      <div className="bg-[#EE6C19] text-[#0C1019] px-4 sm:px-8 lg:px-14 xl:px-20 py-3 text-base sm:text-lg font-medium border-b border-[#D85C0E] transition-all">
        <div className="w-full max-w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="p-1.5 rounded-lg bg-black/10 inline-flex items-center justify-center shrink-0">
              <MegaphoneIcon className="w-4 h-4 text-[#0C1019]" />
            </span>
            <span className="font-bold text-[#0C1019]">
              EthioVuln DAST Suite: Multi-tier vulnerability scanning across OWASP Top 10, CVE database, and API security vectors.
            </span>
          </div>

          <Link
            href="/dashboard/scans/new"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/15 hover:bg-black/25 !text-[#0C1019] font-extrabold text-base transition-colors border border-black/10 shadow-sm"
          >
            Start Free Assessment
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ─── Main Navbar (Pentest-Tools Dark Sleek Navigation) ─────────────── */}
      <header className="bg-[#090D16] border-b border-slate-800 text-white px-4 sm:px-8 lg:px-14 xl:px-20 py-3.5">
        <div className="w-full max-w-full flex items-center justify-between">

          {/* Left Brand Logo (Matching Screenshot) */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            {/* Pentest-Tools Style Angled Dual-Tone Shield */}
            <div className="w-10 h-10 relative flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-10 h-10 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]" viewBox="0 0 36 36" fill="none">
                <path d="M18 3L4 9V17C4 25.5 10 32.5 18 34.5C26 32.5 32 25.5 32 17V9L18 3Z" fill="#111827" stroke="#1E293B" strokeWidth="2" />
                <path d="M18 4L5 9.5V17C5 24.8 10.6 31.4 18 33.3V4Z" fill="#0284C7" />
                <path d="M18 4L31 9.5V17C31 24.8 25.4 31.4 18 33.3V4Z" fill="#F8FAFC" />
                <path d="M18 9L11 13V17C11 21.5 14 25.5 18 27V9Z" fill="#00F0FF" />
                <circle cx="23" cy="18" r="2" fill="#E11D48" />
              </svg>
            </div>

            <div className="flex flex-col leading-none">
              <span className="header-brand-title text-xl font-extrabold tracking-normal text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                Ethio<span className="text-cyan-400">Vuln</span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                Pentest Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            {NAV_MENU.map((menu) => {
              const isDropdownOpen = activeDropdown === menu.label;

              if (!menu.hasDropdown) {
                return (
                  <Link
                    key={menu.label}
                    href={menu.href || '#'}
                    className="px-3.5 py-2 rounded-lg text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {menu.label}
                  </Link>
                );
              }

              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(menu.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === menu.label ? null : menu.label)}
                    aria-expanded={isDropdownOpen}
                    className={`px-3.5 py-2 rounded-lg text-base font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${isDropdownOpen
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 bg-transparent'
                      }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''
                        }`}
                    />
                  </button>

                  {/* Dropdown Menu Flyout */}
                  {isDropdownOpen && menu.items && (
                    <div className={`nav-dropdown absolute top-full ${
                      menu.label === 'Solutions' || menu.label === 'Product'
                        ? 'left-0 w-[640px] lg:w-[700px] max-w-[calc(100vw-3rem)]'
                        : menu.label === 'Services' || menu.label === 'Company' || menu.label === 'Resources'
                        ? 'right-0 w-[640px] lg:w-[700px] max-w-[calc(100vw-3rem)]'
                        : 'left-0 w-[460px] max-w-[calc(100vw-3rem)]'
                      } mt-2 bg-white dark:bg-[#101628] border border-slate-200 dark:border-[#263149] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2.5 mb-2.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">
                          {menu.label === 'Solutions'
                            ? 'Solutions & Tool Suite (One-By-One Breakdown)'
                            : menu.label === 'Services'
                            ? 'Services & Tool Capabilities (One-By-One Breakdown)'
                            : menu.label === 'Company'
                            ? 'Company & Research Architecture (One-By-One Breakdown)'
                            : menu.label === 'Resources'
                            ? 'Security Resources & Knowledge Base (One-By-One Breakdown)'
                            : menu.label === 'Product'
                            ? 'DAST Engines & Scanning Tools (One-By-One Breakdown)'
                            : `${menu.label} Capabilities`}
                        </span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold">EthioVuln Suite</span>
                      </div>

                      {menu.label === 'Solutions' || menu.label === 'Services' || menu.label === 'Product' || menu.label === 'Company' || menu.label === 'Resources' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {menu.items.map((item, i) => (
                            <Link
                              key={i}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="nav-dropdown-item flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#162035] transition-all group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
                            >
                              <DropdownIcon type={item.iconType} />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="nav-dropdown-title text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="nav-dropdown-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="nav-dropdown-desc text-xs text-slate-500 dark:text-slate-400 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors mb-2">
                                  {item.desc}
                                </p>

                                {item.detailTools && item.detailTools.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {item.detailTools.map((tool, tIdx) => (
                                      <span
                                        key={tIdx}
                                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0c1222] text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700/80"
                                      >
                                        ⚙ {tool}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {menu.items.map((item, i) => (
                            <Link
                              key={i}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="nav-dropdown-item flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#162035] transition-all group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
                            >
                              <DropdownIcon type={item.iconType} />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="nav-dropdown-title text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="nav-dropdown-badge text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="nav-dropdown-desc text-xs text-slate-500 dark:text-slate-400 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Dropdown Footer Strip */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-semibold">
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                          {menu.label === 'Solutions'
                            ? 'Looking for the complete architecture and deployment specs?'
                            : menu.label === 'Services'
                            ? 'Need custom assessment scopes or automated enterprise SLA?'
                            : menu.label === 'Company'
                            ? 'Learn more about EthioVuln engineering & security leadership:'
                            : menu.label === 'Resources'
                            ? 'Need developer guides, CLI binaries, or API integration docs?'
                            : menu.label === 'Product'
                            ? 'Explore full engine benchmarks and detection signatures:'
                            : 'Explore all security checks & engines:'}
                        </span>
                        <Link
                          href={
                            menu.label === 'Solutions'
                              ? '/solutions'
                              : menu.label === 'Services'
                              ? '/services'
                              : menu.label === 'Company'
                              ? '/about'
                              : menu.label === 'Resources'
                              ? '/resources'
                              : '/dashboard/scans/new'
                          }
                          onClick={() => setActiveDropdown(null)}
                          className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-bold"
                        >
                          <span>
                            {menu.label === 'Solutions'
                              ? 'View All Solutions & Tool Details'
                              : menu.label === 'Services'
                              ? 'View All Services & Tool Details'
                              : menu.label === 'Company'
                              ? 'Explore About & Researcher Profile'
                              : menu.label === 'Resources'
                              ? 'Explore All Documentation & Guides'
                              : menu.label === 'Product'
                              ? 'Launch DAST Assessment Suite'
                              : 'Launch Assessment Suite'}
                          </span>
                          <span className="text-sm">→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Items (Theme Toggle, Book a demo, Log in, Start free trial) */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Book a demo Link */}
            <Link
              href="/about#contact"
              className="px-3.5 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              Book a demo
            </Link>

            {/* Log in Button */}
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-lg text-base font-bold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A2234] dark:hover:bg-[#242F47] border border-slate-300 dark:border-[#2D3952] transition-colors"
            >
              Log in
            </Link>

            {/* Start free trial Button (Vivid Golden Amber from Screenshot 1) */}
            <Link
              href="/dashboard/scans/new"
              className="px-5 py-2.5 rounded-lg text-base font-extrabold !text-[#0C1019] bg-[#F5A623] hover:bg-[#E09419] shadow-md shadow-orange-500/20 transition-all transform hover:scale-[1.02]"
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

        </div>

        {/* ─── Mobile Drawer Menu ─────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-3 pb-4">
            <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-300">Appearance</span>
              <ThemeToggle showLabel />
            </div>
            <div className="grid grid-cols-2 gap-2 pb-2">
              <Link
                href="/login"
                className="w-full py-2.5 text-center rounded-lg text-sm font-medium bg-[#1A2234] border border-[#2D3952] !text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/dashboard/scans/new"
                className="w-full py-2.5 text-center rounded-lg text-sm font-bold !text-slate-950 bg-[#F5A623]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start free trial
              </Link>
            </div>

            <div className="space-y-1">
              {NAV_MENU.map((item) => (
                <div key={item.label} className="py-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1">
                    {item.label}
                  </span>
                  {item.items ? (
                    item.items.map((sub, j) => (
                      <Link
                        key={j}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-200">{sub.title}</span>
                          {sub.badge && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              {sub.badge}
                            </span>
                          )}
                        </div>
                        {sub.detailTools && sub.detailTools.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {sub.detailTools.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-mono text-cyan-400/80 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                                ⚙ {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-sm text-slate-300 hover:text-cyan-400"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
      </div>
      {/* Dynamic spacer to prevent page content from being obscured behind fixed navbar */}
      <div style={{ height: navHeight }} aria-hidden="true" className="w-full shrink-0 pointer-events-none" />
    </>
  );
}
