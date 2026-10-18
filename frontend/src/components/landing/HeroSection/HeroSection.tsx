'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Inline Self-Contained SVG Icons ──────────────────────────────────────── */
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

export type ScanMode = 'light' | 'deep' | 'cli';

export interface HeroSectionProps {
  children?: React.ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ScanMode>('deep');
  const [targetUrl, setTargetUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [copied, setCopied] = useState(false);

  const cliCommand = `curl -sSL https://get.ethiovuln.io/cli | bash && ethiovuln scan ${targetUrl.trim() || 'https://example.com'
    } --mode=${activeTab === 'cli' ? 'deep' : activeTab}`;

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
    router.push(`/dashboard/scans/new?target=${encodeURIComponent(fullTarget)}&mode=${activeTab}`);
  };

  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-10 xl:px-12 w-full max-w-[1560px] mx-auto overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center relative z-10">

        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Iconic Spider/Bug Card */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E88A2D] text-slate-950 shadow-lg shadow-orange-500/25">
            <SpiderIcon className="w-9 h-9" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            Website <br />
            Vulnerability <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Scanner
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
            Our custom-built Website Vulnerability Scanner detects SQLi, XSS, command injection, XXE, and 75+ more web app vulnerabilities in record time, using proprietary test payloads to <strong className="text-slate-100 font-semibold">prove their exploitability</strong>.
          </p>

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

        {/* Right Column */}
        <div className="lg:col-span-6">
          <div className="bg-[#111827]/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">

            {/* Mode Switcher */}
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

            {/* Description note */}
            <div className="mb-5 px-3.5 py-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">
                {activeTab === 'light' && 'Fast 60s surface scan · SSL/TLS, port discovery & security headers'}
                {activeTab === 'deep' && 'Full dynamic penetration · Nuclei CVE rules, OWASP active spidering'}
                {activeTab === 'cli' && 'Headless developer pipeline · Run scans directly inside CI/CD & bash'}
              </span>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase whitespace-nowrap ml-2">
                {activeTab === 'deep' ? 'Recommended' : activeTab}
              </span>
            </div>

            {/* Light / Deep Scan Form */}
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
              /* CLI Scan */
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

            {/* Daily free scans counter */}
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

      {children}
    </section>
  );
}
