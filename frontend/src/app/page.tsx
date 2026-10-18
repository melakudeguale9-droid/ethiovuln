'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SCAN_TAXONOMY } from '@/data/scanTaxonomy';
import { Navbar } from '@/components/navigation/Navbar';
import { ScanComparisonModal } from '@/components/scans/ScanComparisonModal';

/* ─── Inline Lightweight SVG Icons (Zero External Dependency) ──────────────── */
function SpiderIcon({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* Spider Head & Body */}
      <circle cx="12" cy="7.5" r="2.2" />
      <ellipse cx="12" cy="14" rx="3.5" ry="4.5" />
      {/* Chelicerae / Antennae */}
      <path d="M10.8 5.2 L10 3.8 M13.2 5.2 L14 3.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* 4 Left Legs */}
      <path d="M9.5 8 C6 6.5, 4 8, 3.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M9 11.5 C5 10.5, 3.5 13, 3 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M9 14.5 C5 15, 3.5 18, 3.2 20.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M9.5 17.5 C6.5 19, 5 22.5, 4.5 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* 4 Right Legs */}
      <path d="M14.5 8 C18 6.5, 20 8, 20.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M15 11.5 C19 10.5, 20.5 13, 21 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M15 14.5 C19 15, 20.5 18, 20.8 20.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M14.5 17.5 C17.5 19, 19 22.5, 19.5 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ZapIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function TerminalIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function CopyIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

/* ─── Data Definitions ──────────────────────────────────────────────────────── */
interface EngineSpec {
  label: string;
  val: string;
}

interface EngineData {
  id: string;
  name: string;
  tag: string;
  badgeColor: string;
  accentHex: string;
  description: string;
  specs: EngineSpec[];
}

const ENGINES: EngineData[] = [
  {
    id: 'nuclei',
    name: 'Nuclei Template Engine',
    tag: 'Template-Driven DAST',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    accentHex: '#00F0FF',
    description:
      'Fast and highly customizable vulnerability scanner executing community-curated YAML DSL templates across target hosts with parallel asynchronous I/O and near-zero false positive rates.',
    specs: [
      { label: 'Template Library', val: '8,000+ Verified YAML Rules' },
      { label: 'Detection Scope', val: 'CVEs, Misconfigurations & Exposures' },
      { label: 'Execution Engine', val: 'High-Concurrency Async Go I/O' },
      { label: 'False Positive Ratio', val: '< 0.5% with multi-condition matches' },
    ],
  },
  {
    id: 'zap',
    name: 'OWASP ZAP Engine',
    tag: 'Dynamic Active Scanner',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    accentHex: '#6366F1',
    description:
      'The industry-standard web application security engine. Systematically crawls traditional and modern AJAX frontends, automatically extracting auth tokens and probing for deep server logic vulnerabilities.',
    specs: [
      { label: 'Spidering Mode', val: 'Traditional + AJAX Crawler Engine' },
      { label: 'Attack Injection', val: 'SQLi, XSS, Path Traversal & SSRF' },
      { label: 'Compliance Scope', val: 'OWASP Top 10 & WASC Threat Matrix' },
      { label: 'Session Handling', val: 'Automated Token & Cookie Rotation' },
    ],
  },
  {
    id: 'fuzzer',
    name: 'Smart Discovery Fuzzer',
    tag: 'Recon & Content Discovery',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    accentHex: '#10B981',
    description:
      'Proprietary concurrent HTTP probing engine designed to unmask unlinked endpoints, exposed source code (.git), environment files (.env), hidden admin portals, and critical missing security headers.',
    specs: [
      { label: 'Wordlist Precision', val: 'High-Probability Sensitive Endpoints' },
      { label: 'Header Audits', val: 'CSP, HSTS, CORS & Permissions Policies' },
      { label: 'Sensitive Exposures', val: '.env, .git, config backups & admin URLs' },
      { label: 'Rate Adaptation', val: 'Dynamic Backoff on 429 Rate Limits' },
    ],
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Target Input & SSRF Gate',
    desc: 'Multi-layer URL validation resolves target DNS and strictly isolates private RFC 1918 subnets, AWS metadata (169.254.169.254), and loopback addresses.',
    badge: 'Security Gate',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    step: '02',
    title: 'Multi-Engine Discovery',
    desc: 'Parallel execution of Nuclei YAML templates, OWASP ZAP active spidering, and Smart Fuzzer probes coordinated via asynchronous background queues.',
    badge: 'Active Scan',
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  },
  {
    step: '03',
    title: 'CVSS v3.1 & CWE Scoring',
    desc: 'Raw findings are deduplicated, normalized, and scored with exact CVSS v3.1 base vectors directly mapped to MITRE CWE classification taxonomies.',
    badge: 'Analysis',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    step: '04',
    title: 'Executive PDF Export',
    desc: 'Automated executive and technical reporting featuring severity breakdowns, reproduction curl commands, and actionable developer fix guidance.',
    badge: 'Reporting',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
];

const TELEMETRY_CARDS = [
  { label: 'Vulnerability Engine', value: 'Nuclei v3 + ZAP 2.14', tag: 'Dual Core' },
  { label: 'Template Signatures', value: '8,000+ Community Definitions', tag: 'Continuous' },
  { label: 'Assessment Standards', value: 'CVSS v3.1 & OWASP Top 10', tag: 'Standardized' },
  { label: 'Exploit Accuracy', value: '< 0.5% False Positives', tag: 'Verified' },
];

type ScanMode = 'light' | 'deep' | 'cli';

/* ─── Main Landing Page Component ─────────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ScanMode>('deep');
  const [selectedVectorId, setSelectedVectorId] = useState<string>('full_enterprise');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonCategory, setComparisonCategory] = useState<string>('all');
  const [targetUrl, setTargetUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeEngineId, setActiveEngineId] = useState<string>('nuclei');

  const currentEngine = ENGINES.find((e) => e.id === activeEngineId) || ENGINES[0];

  const cliCommand = `curl -sSL https://get.ethiovuln.io/cli | bash && ethiovuln scan ${targetUrl.trim() || 'https://example.com'
    } --mode=${activeTab === 'cli' ? selectedVectorId : (activeTab === 'light' ? 'passive_scan' : selectedVectorId)}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchScan = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = targetUrl.trim();
    if (!clean) {
      setUrlError('Please enter a target URL or IP address');
      return;
    }
    setUrlError('');
    const fullTarget = clean.startsWith('http') ? clean : `https://${clean}`;
    const modeParam = activeTab === 'light' ? 'passive_scan' : selectedVectorId;
    router.push(`/dashboard/scans/new?target=${encodeURIComponent(fullTarget)}&mode=${modeParam}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] font-sans selection:bg-cyan-500/25 selection:text-cyan-200">

      {/* ─── Pentest-Tools Style Navigation Header ───────────────────────── */}
      <Navbar />

      {/* ─── Hero Section (Pentest-Tools 2-Column Style) ───────────────────── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1560px] mx-auto overflow-hidden">
        {/* Ambient Cyan Backdrop Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center relative z-10">

          {/* Left Column: Title, Spider Badge & Description */}
          <div className="lg:col-span-6 space-y-6">

            {/* Iconic Amber Spider/Bug Card (From Screenshot 1) */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E88A2D] text-slate-950 shadow-lg shadow-orange-500/25">
              <SpiderIcon className="w-9 h-9" />
            </div>

            {/* Giant Bold Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              Website <br />
              Vulnerability <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Scanner
              </span>
            </h1>

            {/* Subtitle with highlighted exploitability */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Our custom-built Website Vulnerability Scanner detects SQLi, XSS, command injection, XXE, and 75+ more web app vulnerabilities in record time, using proprietary test payloads to <strong className="text-slate-100 font-semibold">prove their exploitability</strong>.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard/scans/new"
                className="px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center gap-2 group transform hover:-translate-y-0.5"
              >
                Start Free Scan
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#engines"
                className="px-8 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all transform hover:-translate-y-0.5"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Scan Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#111827]/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">

              {/* Scan Mode Switcher (Matching Screenshot 1) */}
              <div className="grid grid-cols-3 gap-2 bg-[#090D16] p-1.5 rounded-xl mb-6 border border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('light');
                    setUrlError('');
                  }}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'light'
                      ? 'bg-sky-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Light scan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('deep');
                    setUrlError('');
                  }}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'deep'
                      ? 'bg-[#7BB2E8] text-slate-950 font-bold shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Deep scan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cli');
                    setUrlError('');
                  }}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'cli'
                      ? 'bg-sky-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  CLI scan
                </button>
              </div>

              {/* Mode Context Description */}
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  {activeTab === 'light' && 'Fast 60s surface scan · SSL/TLS, port discovery & security headers'}
                  {activeTab === 'deep' && 'Full dynamic penetration · Nuclei CVE rules, OWASP active spidering'}
                  {activeTab === 'cli' && 'Headless developer pipeline · Run scans directly inside CI/CD & bash'}
                </span>
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase whitespace-nowrap ml-2">
                  {activeTab === 'deep' ? 'Recommended' : activeTab}
                </span>
              </div>

              {/* Enable Deep Scans / Light vs Deep Comparison Link (Matching Reference) */}
              <button
                type="button"
                onClick={() => {
                  setComparisonCategory(activeTab === 'light' ? 'passive_scan' : selectedVectorId);
                  setIsComparisonOpen(true);
                }}
                className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between transition-all group shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="p-1 rounded bg-cyan-500/20 text-cyan-300">
                    <ZapIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>Enable Deep Scans: <strong>Light vs Deep comparison matrix</strong></span>
                </span>
                <span className="text-[11px] text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                  View All 8 Categories <span>→</span>
                </span>
              </button>

              {/* Assessment Vector Selector (8 Taxonomy Categories) */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    Assessment Vector (8 Core Categories)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setComparisonCategory(selectedVectorId);
                      setIsComparisonOpen(true);
                    }}
                    className="text-cyan-400 hover:underline text-[11px] font-mono cursor-pointer"
                  >
                    Compare Checks ↗
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={selectedVectorId}
                    onChange={(e) => {
                      setSelectedVectorId(e.target.value);
                      if (activeTab === 'light') setActiveTab('deep');
                    }}
                    className="w-full py-2.5 px-3 bg-[#0A0E18] border border-slate-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer appearance-none pr-8"
                  >
                    {SCAN_TAXONOMY.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-900 text-white py-1">
                        0{cat.number}. {cat.title} ({cat.tag})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* VIEW 1: Light & Deep Web Scan Form */}
              {activeTab !== 'cli' ? (
                <form onSubmit={handleLaunchScan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target URL or IP Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <SearchIcon className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        value={targetUrl}
                        onChange={(e) => {
                          setTargetUrl(e.target.value);
                          if (urlError) setUrlError('');
                        }}
                        placeholder="https://example.com"
                        className={`w-full pl-12 pr-4 py-4 bg-[#0B0F19] border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${urlError
                            ? 'border-red-500/80 focus:ring-1 focus:ring-red-500'
                            : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                          }`}
                      />
                    </div>
                    {urlError && <p className="text-xs text-red-400 mt-1.5">{urlError}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                  >
                    <ZapIcon className="w-5 h-5" />
                    Launch Vulnerability Scan
                  </button>
                </form>
              ) : (
                /* VIEW 2: CLI Terminal Snippet */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-cyan-400" />
                      Terminal Command
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyCli}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-cyan-300 leading-relaxed">
                    <div className="flex items-center gap-1.5 pb-2.5 mb-2 border-b border-slate-800/80 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                      <span className="ml-2 text-[10px] text-slate-400">bash terminal</span>
                    </div>
                    <p className="select-all break-all">{cliCommand}</p>
                  </div>

                  <Link
                    href="/dashboard/scans/new"
                    className="w-full py-3.5 bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    Configure Advanced Scan Profiles →
                  </Link>
                </div>
              )}

              {/* Free Scans Badge (Matching Screenshot 1) */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  2/2 daily free scans available
                </span>
                <span className="text-cyan-400 font-medium">No credit card required</span>
              </div>

            </div>
          </div>

        </div>

        {/* ─── Telemetry Metrics Ribbon ────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TELEMETRY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {card.tag}
                </span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Multi-Engine Scanning Pipeline ─────────────────────── */}
      <section id="engines" className="py-20 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1560px] mx-auto border-t border-slate-800/60">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Architecture Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Multi-Engine Scanning Pipeline
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Combines signature scanning, crawler-based attack injection, and directory brute-forcing into a single coordinated stream.
          </p>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {ENGINES.map((engine) => {
            const isSelected = engine.id === activeEngineId;
            return (
              <button
                key={engine.id}
                type="button"
                onClick={() => setActiveEngineId(engine.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${isSelected
                    ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
              >
                {engine.name}
              </button>
            );
          })}
        </div>

        {/* Engine Specs Display Card */}
        <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${currentEngine.badgeColor}`}>
                {currentEngine.tag}
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-2">
                {currentEngine.name}
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ENGINE STATUS: OPERATIONAL</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            {currentEngine.description}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentEngine.specs.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {item.label}
                </div>
                <div className="text-xs font-mono font-bold text-cyan-300">
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Multi-Tier Scanning Taxonomy Grid ────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1560px] mx-auto border-t border-slate-800/60">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Scan Taxonomy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            8 Assessment Vectors & Coverage
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Systematic active injection, passive telemetry audits, container inspection, and API security organized into standardized tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SCAN_TAXONOMY.map((cat) => {
            const totalChecks = cat.subCategories.reduce(
              (acc, sub) => acc + sub.checks.length,
              0
            );

            return (
              <Link
                key={cat.id}
                href={`/dashboard/scans/new?mode=${cat.id}`}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_20px_rgba(0,240,255,0.12)] group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        borderColor: `${cat.color}40`,
                        color: cat.color,
                        backgroundColor: `${cat.color}15`,
                      }}
                    >
                      {cat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    0{cat.number}. {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {cat.subCategories.length} Modules · {totalChecks} Checks
                  </span>
                  <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Launch →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Capability Comparison Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-sky-950/30 to-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🛡️</span>
              <span>Need a detailed capability breakdown for compliance or scoping?</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore the exact check-by-check breakdown between Light Scan surface audits and Deep Scan active exploit verification.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setComparisonCategory('all');
              setIsComparisonOpen(true);
            }}
            className="shrink-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            Open Full Comparison Matrix
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ─── 4-Phase Assessment Workflow Grid ─────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1560px] mx-auto border-t border-slate-800/60">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            End-To-End Execution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Four-Phase Assessment Flow
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Structured pipeline ensuring safe ingestion, deep inspection, standardized severity scoring, and executive reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xl font-extrabold text-cyan-400">
                    {step.step}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${step.color}`}>
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Call to Action Panel ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1560px] mx-auto">
        <div className="p-10 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B0F19] to-slate-900 border border-cyan-500/30 text-center relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300 hover:border-cyan-400">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              Ready to Secure Your Web Applications?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Launch active vulnerabilities checks, detect sensitive data exposure, and generate verifiable CVSS v3.1 reports in minutes.
            </p>
            <Link
              href="/dashboard/scans/new"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transform hover:scale-105 transition-all duration-300"
            >
              Launch Assessment Suite →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Cyber Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 py-10 px-4 sm:px-6 lg:px-10 xl:px-12 text-center text-xs text-slate-500">
        <div className="w-full max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">EthioVuln</span>
            <span>·</span>
            <span>Automated Dynamic Application Security Testing Suite</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard/scans/new" className="hover:text-cyan-400 transition-colors">
              New Scan
            </Link>
            <Link href="/about" className="hover:text-cyan-400 transition-colors">
              About & Architecture
            </Link>
            <Link href="/login" className="hover:text-cyan-400 transition-colors">
              Operator Login
            </Link>
          </div>
        </div>
      </footer>

      {/* ─── Scan Depth Comparison Matrix Modal ──────────────────────────── */}
      <ScanComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        initialCategoryId={comparisonCategory}
        onSelectMode={(modeId) => {
          setSelectedVectorId(modeId);
          setActiveTab('deep');
        }}
      />
    </div>
  );
}
