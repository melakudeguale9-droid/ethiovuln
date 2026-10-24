'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CyberKeyIllustration } from './CyberKeyIllustration';
import { ReportCardMockup } from './ReportCardMockup';
import {
  AuthVisualizer,
  OobVisualizer,
  OwaspVisualizer,
  ProofVisualizer,
  CrawlerVisualizer,
  ReportingVisualizer,
  CicdVisualizer,
  MonitoringVisualizer,
} from './FeatureVisualizers';
import { CliTerminalCard } from '../CliScanSection/CliScanSection';

/* ─── Self-Contained SVG Icons (Zero External Dependencies) ─────────────────── */
function DocumentReportIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function BookOpenIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function BarChartIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function ExternalLinkIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function TerminalIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function DownloadIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronLeftIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function HelpCircleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ─── Secondary Quick Nav Items (Exact Pentest-Tools Subheader) ────────────── */
const QUICK_NAV_ITEMS = [
  { label: 'Full sample report', icon: DocumentReportIcon, href: '#report-preview', isExternal: false },
  { label: 'How it works', icon: BookOpenIcon, href: '#workflow', isExternal: false },
  { label: 'Benchmark', icon: BarChartIcon, href: '#engines', isExternal: false },
  { label: 'CLI Tool', icon: TerminalIcon, href: '#cli-scan', isExternal: false },
  { label: 'FAQ', icon: HelpCircleIcon, href: '#faq', isExternal: false },
  { label: 'Tool docs', icon: ExternalLinkIcon, href: '/about#architecture', isExternal: true },
  { label: 'API', icon: ExternalLinkIcon, href: '/about#api', isExternal: true },
];

/* ─── 10 Product Capabilities (Matching Pentest-Tools 10-Step Story) ───────── */
export interface FeatureStage {
  id: number;
  stageName: string;
  headline: string;
  contentAlign: 'text-left' | 'text-right'; // Even = text left, Odd = text right (exact Pentest-Tools pattern)
  body: React.ReactNode;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function SampleReportSection() {
  const [activeStage, setActiveStage] = useState(0);

  const stages: FeatureStage[] = [
    /* ─── Stage 0: Documented Evidence & Report Card (media_1792322420545.png) ─── */
    {
      id: 0,
      stageName: 'Documented Evidence',
      headline: 'Find exploitable web app vulnerabilities with documented evidence',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Our proprietary Website Vulnerability Scanner gives security pros and appsec teams what they need: highly{' '}
            <strong className="text-slate-100 font-semibold">accurate, validated findings</strong> and{' '}
            <strong className="text-slate-100 font-semibold">actionable evidence</strong> - not just a long list of possible exposure points.
          </p>
          <p>
            Unlike generic scanners that flag potential issues without context, our tool uses{' '}
            <strong className="text-slate-100 font-semibold">out-of-band detection</strong> to minimize false positives and ensure reliable results, collecting{' '}
            <strong className="text-slate-100 font-semibold">proof</strong> along the way.
          </p>
          <p>
            Perform <strong className="text-slate-100 font-semibold">unauthenticated recon</strong>, deep{' '}
            <strong className="text-slate-100 font-semibold">authenticated testing</strong>, or{' '}
            <strong className="text-slate-100 font-semibold">automated compliance scans</strong> - all with a powerful, easy-to-use tool that blends into your workflow.
          </p>
        </div>
      ),
      primaryCta: { label: 'Generate Live Report', href: '/dashboard/scans/new' },
      secondaryCta: { label: 'View Sample PDF', href: '/about#report' },
    },

    /* ─── Stage 1: Real Attacker / Cyber Key (media_1792322814060.png) ────────── */
    {
      id: 1,
      stageName: 'Test Like a Real Attacker',
      headline: 'Get more from every scan. Test web apps like a real attacker',
      contentAlign: 'text-right',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            <strong className="text-slate-100 font-semibold">Simulate authenticated and unauthenticated attacks</strong> to uncover deeper security flaws, such as{' '}
            <Link
              href="/dashboard/scans/new?focus=ssrf"
              className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-cyan-400 hover:decoration-cyan-400 transition-colors"
            >
              SSRF with access to an internal service
            </Link>
            ,{' '}
            <Link
              href="/dashboard/scans/new?focus=cmdi"
              className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-cyan-400 hover:decoration-cyan-400 transition-colors"
            >
              OS command injection
            </Link>
            , exposed credentials, and misconfigurations in SPAs, APIs, and traditional web apps.
          </p>
          <p>
            The Website Vulnerability Scanner on EthioVuln.com mimics real attackers&apos; tactics and focuses on{' '}
            <strong className="text-slate-100 font-semibold">realistic, exploitable issues</strong> rather than ticking boxes.
          </p>
          <p>
            We keep it sharp by{' '}
            <Link
              href="/about#methodology"
              className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-cyan-400 hover:decoration-cyan-400 transition-colors"
            >
              battle-testing it
            </Link>{' '}
            every day in web app pentests that our{' '}
            <Link
              href="/about#team"
              className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-cyan-400 hover:decoration-cyan-400 transition-colors"
            >
              offensive security services team
            </Link>{' '}
            performs.
          </p>
        </div>
      ),
      primaryCta: { label: 'Simulate Attack Vector', href: '/dashboard/scans/new' },
      secondaryCta: { label: 'Explore Methodology', href: '/about#methodology' },
    },

    /* ─── Stage 2: Authenticated Scanning ───────────────────────────────────── */
    {
      id: 2,
      stageName: 'Authenticated Session Audit',
      headline: 'Scan behind login walls, OAuth flows, and authenticated portals',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Surface vulnerabilities where attackers thrive: behind the authentication barrier. EthioVuln supports{' '}
            <strong className="text-slate-100 font-semibold">automated multi-step form logins</strong>, custom{' '}
            <strong className="text-slate-100 font-semibold">session cookie injection</strong>, and{' '}
            <strong className="text-slate-100 font-semibold">Bearer token preservation</strong> across dynamic sessions.
          </p>
          <p>
            Audit role-based privilege escalation (IDOR) and broken object access control across privileged administrative endpoints.
          </p>
        </div>
      ),
      primaryCta: { label: 'Configure Auth Scan', href: '/dashboard/scans/new' },
      secondaryCta: { label: 'Session Docs', href: '/about#auth' },
    },

    /* ─── Stage 3: Out-of-Band (OOB) Detection ──────────────────────────────── */
    {
      id: 3,
      stageName: 'Out-of-Band & Blind Attacks',
      headline: 'Detect blind vulnerabilities with dedicated OOB listener infrastructure',
      contentAlign: 'text-right',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Blind SQL injection, blind XXE, and asynchronous SSRF rarely output content in the HTTP response body.
          </p>
          <p>
            Our dedicated <strong className="text-slate-100 font-semibold">Out-of-Band (OOB) listener service</strong> catches reverse DNS, HTTP, and SMB interactions initiated by vulnerable backends, validating exploits that generic scanners miss completely.
          </p>
        </div>
      ),
      primaryCta: { label: 'Test Blind SSRF Engine', href: '/dashboard/scans/new' },
      secondaryCta: { label: 'OOB Architecture', href: '/about#oob' },
    },

    /* ─── Stage 4: Comprehensive OWASP Top 10 Coverage ──────────────────────── */
    {
      id: 4,
      stageName: 'OWASP Top 10 Coverage',
      headline: 'Exhaustive coverage of modern web application and API threat matrices',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Stay compliant and resilient against the <strong className="text-slate-100 font-semibold">OWASP Top 10</strong> standard. Every scan systematically tests for Broken Access Control, Cryptographic Failures, Injection, Insecure Design, and Security Misconfiguration.
          </p>
          <p>
            Each finding includes detailed CVSS v3.1 scoring, business impact estimation, and remediation guidance.
          </p>
        </div>
      ),
      primaryCta: { label: 'View OWASP Matrix', href: '/dashboard/scans/new' },
      secondaryCta: { label: 'Taxonomy Breakdown', href: '/about#taxonomy' },
    },

    /* ─── Stage 5: Zero False Positives ─────────────────────────────────────── */
    {
      id: 5,
      stageName: 'Verified Exploit Proof',
      headline: 'Zero noise. Every confirmed finding comes with indisputable proof',
      contentAlign: 'text-right',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Stop wasting hours chasing down theoretical warnings. When EthioVuln marks a vulnerability as{' '}
            <strong className="text-emerald-400 font-bold uppercase">CONFIRMED</strong>, we show you the exact request payload sent and the extracted server output received.
          </p>
          <p>
            Replay any finding in a single click with pre-formatted cURL commands or Burp Suite request files.
          </p>
        </div>
      ),
      primaryCta: { label: 'Inspect Proof Engine', href: '/dashboard/scans/new' },
      secondaryCta: { label: 'False Positive Policy', href: '/about#validation' },
    },

    /* ─── Stage 6: Modern SPA Crawler ───────────────────────────────────────── */
    {
      id: 6,
      stageName: 'Single Page App Crawler',
      headline: 'Crawl dynamic JavaScript frameworks with a headless browser engine',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Traditional spiders break on modern JavaScript frameworks. EthioVuln utilizes a headless Chromium crawler that executes client-side code, intercepts pushState route changes, clicks interactive buttons, and triggers DOM XSS sinks in React, Vue, Next.js, and Angular apps.
          </p>
        </div>
      ),
      primaryCta: { label: 'Crawl Modern App', href: '/dashboard/scans/new' },
    },

    /* ─── Stage 7: CLI Version (media_1792323869904.png & media_1792323934335.png) ─── */
    {
      id: 7,
      stageName: 'Command Line Interface (CLI)',
      headline: 'Use this tool from your command line interface',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            If you prefer it, we also provide a CLI version of our Website Vulnerability Scanner. Through the EthioVuln CLI, you can run{' '}
            <a
              href="#cli-scan"
              className="text-slate-300 underline underline-offset-4 decoration-slate-600 hover:text-cyan-400 hover:decoration-cyan-400 transition-colors font-semibold"
            >
              Light scans
            </a>{' '}
            against your web apps and start gathering insights for your next move.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/downloads/ethiovuln-cli-linux.tar.gz"
              download
              className="px-5 py-2.5 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 hover:bg-[#1C2333] text-slate-200 font-semibold text-xs sm:text-sm transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <DownloadIcon className="w-4 h-4 text-slate-400" />
              <span>Linux</span>
            </a>
            <a
              href="/downloads/ethiovuln-cli-darwin.tar.gz"
              download
              className="px-5 py-2.5 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 hover:bg-[#1C2333] text-slate-200 font-semibold text-xs sm:text-sm transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <DownloadIcon className="w-4 h-4 text-slate-400" />
              <span>macOS</span>
            </a>
          </div>
        </div>
      ),
      primaryCta: { label: 'Explore CLI Instructions', href: '#cli-scan' },
      secondaryCta: { label: 'Quickstart -h', href: '#cli-scan' },
    },

    /* ─── Stage 8: CI/CD & DevSecOps ────────────────────────────────────────── */
    {
      id: 8,
      stageName: 'DevSecOps Automation',
      headline: 'Automate security gates directly in your GitHub Actions and GitLab CI',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Prevent insecure code from reaching production. Use our lightweight CLI and REST API to trigger automated regression scans on pull requests, breaking the build if critical flaws are introduced.
          </p>
        </div>
      ),
      primaryCta: { label: 'Integrate CI/CD Pipeline', href: '/about#api' },
    },

    /* ─── Stage 9: Next Step: Try These Tools (media_1792325385334.png) ────────── */
    {
      id: 9,
      stageName: 'Next Steps & Tool Suite',
      headline: 'Ready for your next step? Try these tools',
      contentAlign: 'text-left',
      body: (
        <div className="space-y-4 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal font-normal">
          <p>
            Choose from our specialized tool suite for reconnaissance, port scanning, subdomains, network penetration, and automated exploitation.
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium pt-1">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#10B981] bg-transparent inline-block shrink-0" />
            <span>Try the light version for free</span>
          </div>
        </div>
      ),
      primaryCta: { label: 'Explore All Security Tools', href: '#try-tools' },
      secondaryCta: { label: 'New Web Assessment', href: '/dashboard/scans/new' },
    },
  ];

  const currentStage = stages[activeStage] || stages[0];

  // Helper to render the appropriate visualizer card for each stage
  const renderVisualizer = (stageId: number) => {
    switch (stageId) {
      case 0:
        return <ReportCardMockup />;
      case 1:
        return <CyberKeyIllustration />;
      case 2:
        return <AuthVisualizer />;
      case 3:
        return <OobVisualizer />;
      case 4:
        return <OwaspVisualizer />;
      case 5:
        return <ProofVisualizer />;
      case 6:
        return <CrawlerVisualizer />;
      case 7:
        return <CliTerminalCard />;
      case 8:
        return <CicdVisualizer />;
      case 9:
        return <MonitoringVisualizer />;
      default:
        return <ReportCardMockup />;
    }
  };

  return (
    <section id="report-preview" className="relative bg-[#090D16] border-t border-slate-800">

      {/* ─── Secondary Navigation Sub-Bar (Exact Pentest-Tools Subheader) ──── */}
      <div className="border-b border-slate-800 bg-[#090D16] sticky top-16 z-30">
        <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-3.5 flex items-center justify-between overflow-x-auto scrollbar-none text-base font-semibold text-slate-200">
          <div className="flex items-center gap-6 sm:gap-10 shrink-0">
            {QUICK_NAV_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className="inline-flex items-center gap-2.5 hover:text-cyan-400 transition-colors whitespace-nowrap py-1 group font-medium"
                >
                  <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Quick Stage Nav Controls */}
          <div className="hidden md:flex items-center gap-3 shrink-0 pl-6 border-l border-slate-800 text-base font-mono text-slate-300">
            <span>Capability {activeStage + 1} of 10</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                aria-label="Previous capability"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                aria-label="Next capability"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid: Interactive 10-Stage Feature Showcase ─────── */}
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">

        {/* Mobile Stage Selector Pill Carousel */}
        <div className="flex sm:hidden items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
          <span className="text-base font-mono font-bold text-cyan-400 uppercase tracking-wider">
            {currentStage.stageName}
          </span>
          <div className="flex items-center gap-2.5 text-base font-mono text-slate-300">
            <span>{activeStage + 1} / 10</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                className="p-2 rounded-lg bg-slate-800 text-slate-200"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                className="p-2 rounded-lg bg-slate-800 text-slate-200"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Two-Column Interactive Layout ─────────────────────────────────── */}
        <div className="flex items-start gap-6 lg:gap-10">

          {/* Vertical 10-Step Rail Indicator (Exact Pentest-Tools Left Rail) */}
          <div className="hidden sm:flex flex-col items-center gap-2.5 pt-4 select-none shrink-0" aria-label="Product Capabilities">
            {stages.map((stg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStage(i)}
                title={`Stage ${i + 1}: ${stg.stageName}`}
                className={`transition-all duration-300 rounded-full cursor-pointer group relative ${i === activeStage
                  ? 'w-1.5 h-7 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                  : 'w-1 h-3.5 bg-slate-700/60 hover:bg-slate-400 hover:h-5'
                  }`}
                aria-label={`Jump to stage ${i + 1}: ${stg.stageName}`}
              >
                {/* Tooltip on hover */}
                <span className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 border border-slate-700 text-slate-200 text-base font-sans font-semibold py-1.5 px-3 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
                  {i + 1}. {stg.stageName}
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Content Grid: Alternating Layout */}
          <div className="flex-1">
            {currentStage.contentAlign === 'text-left' ? (
              /* Text on Left, Visualizer on Right (Stage 0, 2, 4, 6, 8) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">

                {/* Left: Text & CTA */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-base font-mono font-bold tracking-wide">
                    <span>CAPABILITY {activeStage + 1} OF 10</span>
                    <span className="text-slate-600">•</span>
                    <span>{currentStage.stageName}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-normal leading-relaxed">
                    {currentStage.headline}
                  </h2>

                  {currentStage.body}

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={currentStage.primaryCta.href}
                      className="px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 !text-slate-950 font-extrabold text-base sm:text-lg shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span className="!text-slate-950 font-extrabold tracking-normal">{currentStage.primaryCta.label}</span>
                      <span className="text-base font-extrabold !text-slate-950">→</span>
                    </Link>

                    {currentStage.secondaryCta && (
                      <Link
                        href={currentStage.secondaryCta.href}
                        className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 font-bold text-base sm:text-lg transition-all"
                      >
                        {currentStage.secondaryCta.label}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right: Visualizer Graphic */}
                <div className="lg:col-span-6">
                  {renderVisualizer(activeStage)}
                </div>

              </div>
            ) : (
              /* Visualizer on Left, Text on Right (Stage 1, 3, 5, 7, 9 - media_1792322814060.png) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">

                {/* Left: Visualizer Graphic (Cyber Key for Stage 1) */}
                <div className="lg:col-span-6 order-2 lg:order-1">
                  {renderVisualizer(activeStage)}
                </div>

                {/* Right: Headline, Copy & CTAs */}
                <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-base font-mono font-bold tracking-wide">
                    <span>CAPABILITY {activeStage + 1} OF 10</span>
                    <span className="text-slate-600">•</span>
                    <span>{currentStage.stageName}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-normal leading-relaxed">
                    {currentStage.headline}
                  </h2>

                  {currentStage.body}

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={currentStage.primaryCta.href}
                      className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base sm:text-lg shadow-lg shadow-amber-400/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                    >
                      <span>{currentStage.primaryCta.label}</span>
                      <span className="text-base font-bold">→</span>
                    </Link>

                    {currentStage.secondaryCta && (
                      <Link
                        href={currentStage.secondaryCta.href}
                        className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 font-bold text-base sm:text-lg transition-all"
                      >
                        {currentStage.secondaryCta.label}
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

      {/* ─── Floating Daily Free Scans Banner Bar (Exact Pentest-Tools Bottom Pill) ── */}
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 pb-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3 bg-[#111827] border border-slate-800 rounded-full px-4 py-2 shadow-lg">
          <span className="text-slate-300 font-medium">
            <strong className="text-amber-400">2/2</strong> daily free scans available
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">I</kbd>
          </div>
          <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
            <div className="bg-amber-400 h-full w-full rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/scans/new"
            className="flex items-center gap-2 bg-[#0E1524] hover:bg-[#141C30] border border-cyan-500/30 rounded-full px-3.5 py-1.5 text-xs text-slate-200 transition-colors shadow-md group"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-400">ask ethiovuln_</span>
          </Link>

          <a
            href="#report-preview"
            title="Scroll to section top"
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            ↑
          </a>
        </div>
      </div>

    </section>
  );
}
