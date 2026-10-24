'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SCAN_TAXONOMY, type AssessmentCategory } from '@/data/scanTaxonomy';

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

function ChevronDownIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type ScanMode = 'light' | 'deep' | 'cli';

export interface HeroSectionProps {
  activeTab?: ScanMode;
  setActiveTab?: (tab: ScanMode) => void;
  selectedVectorId?: string;
  setSelectedVectorId?: (id: string) => void;
  targetUrl?: string;
  setTargetUrl?: (url: string) => void;
  urlError?: string;
  setUrlError?: (err: string) => void;
  onLaunchScan?: (e: React.FormEvent) => void;
  onOpenComparison?: (category?: string) => void;
  scanTaxonomy?: AssessmentCategory[];
  children?: React.ReactNode;
}

export function HeroSection({
  activeTab: controlledActiveTab,
  setActiveTab: controlledSetActiveTab,
  selectedVectorId: controlledSelectedVectorId,
  setSelectedVectorId: controlledSetSelectedVectorId,
  targetUrl: controlledTargetUrl,
  setTargetUrl: controlledSetTargetUrl,
  urlError: controlledUrlError,
  setUrlError: controlledSetUrlError,
  onLaunchScan: controlledOnLaunchScan,
  onOpenComparison: controlledOnOpenComparison,
  scanTaxonomy = SCAN_TAXONOMY,
  children,
}: HeroSectionProps) {
  const router = useRouter();

  // Internal state fallbacks if not controlled by parent
  const [internalActiveTab, setInternalActiveTab] = useState<ScanMode>('light');
  const [internalSelectedVectorId, setInternalSelectedVectorId] = useState<string>('full_enterprise');
  const [internalTargetUrl, setInternalTargetUrl] = useState('');
  const [internalUrlError, setInternalUrlError] = useState('');
  const [copied, setCopied] = useState(false);

  const [protocol, setProtocol] = useState<'https' | 'http'>('https');
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = controlledSetActiveTab ?? setInternalActiveTab;
  const selectedVectorId = controlledSelectedVectorId ?? internalSelectedVectorId;
  const setSelectedVectorId = controlledSetSelectedVectorId ?? setInternalSelectedVectorId;
  const targetUrl = controlledTargetUrl ?? internalTargetUrl;
  const setTargetUrl = controlledSetTargetUrl ?? setInternalTargetUrl;
  const urlError = controlledUrlError ?? internalUrlError;
  const setUrlError = controlledSetUrlError ?? setInternalUrlError;

  const defaultLaunchScan = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = targetUrl.trim();
    if (!clean) {
      setUrlError('Please enter a target URL or IP address');
      return;
    }
    setUrlError('');
    const fullTarget = clean.startsWith('http://') || clean.startsWith('https://')
      ? clean
      : `${protocol}://${clean}`;
    const modeParam = activeTab === 'light' ? 'passive_scan' : selectedVectorId;
    router.push(`/dashboard/scans/new?target=${encodeURIComponent(fullTarget)}&mode=${modeParam}`);
  };

  const onLaunchScan = controlledOnLaunchScan ?? defaultLaunchScan;

  const onOpenComparison = (category?: string) => {
    if (controlledOnOpenComparison) {
      controlledOnOpenComparison(category);
    }
  };

  const cliCommand = `curl -sSL https://get.ethiovuln.io/cli | bash && ethiovuln scan ${targetUrl.trim() || 'https://example.com'
    } --mode=${activeTab === 'cli' ? selectedVectorId : (activeTab === 'light' ? 'passive_scan' : selectedVectorId)}`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-4 sm:pt-6 lg:pt-8 pb-16 lg:pb-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full overflow-hidden">
      {/* Grid container with items-start */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start relative z-10">

        {/* ─── Left Column: Title, Spider Badge & Description (Moved Upwards) ─── */}
        <div className="lg:col-span-6 space-y-5 pt-0 lg:-mt-2">
          {/* Iconic Amber Spider/Bug Card (From Screenshot 1) */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E88A2D] text-slate-950 shadow-md">
            <SpiderIcon className="w-9 h-9" />
          </div>

          {/* Giant Bold Headline (Spacious, High Contrast White, Relaxed Line Height) */}
          <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-bold tracking-normal leading-relaxed text-white">
            Website <br />
            Vulnerability <br />
            Scanner
          </h1>

          {/* Subtitle with highlighted exploitability */}
          <p className="text-base sm:text-lg text-gray-150 max-w-xl leading-relaxed tracking-normal">
            Our custom-built Website Vulnerability Scanner detects SQLi, XSS, command injection, XXE, and 75+ more web app vulnerabilities in record time, using proprietary test payloads to{' '}
            <strong className="text-white font-bold">prove their exploitability</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard/scans/new"
              className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 !text-slate-950 font-extrabold text-base sm:text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 group transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="!text-slate-950 font-extrabold tracking-normal">Start Free Scan</span>
              <ArrowRightIcon className="w-5 h-5 !text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#engines"
              className="px-8 py-4 rounded-xl bg-[#111827] border border-slate-700 text-slate-300 font-semibold text-base sm:text-lg hover:bg-[#1E293B] hover:border-slate-600 hover:text-slate-100 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* ─── Right Column: Interactive Scan Card (Pentest-Tools Exact Match) ───────────── */}
        <div className="lg:col-span-6 lg:pt-28 xl:pt-36">
          <div className="hero-scan-card bg-[#F3F8FD] dark:bg-[#111827] border border-[#BDD4EE] dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden relative transition-colors duration-300">

            {/* ─── Top Tabs Header (Exact Match to Screenshot) ─── */}
            <div className="flex items-stretch bg-[#F3F8FD] dark:bg-[#111827] h-14 sm:h-16 select-none relative">
              {activeTab === 'light' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('light');
                      setUrlError('');
                    }}
                    className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#335F8E] dark:text-cyan-400 bg-[#F3F8FD] dark:bg-[#111827] rounded-tl-[28px] cursor-pointer"
                  >
                    Light scan
                  </button>
                  <div className="flex-[2] flex items-stretch bg-[#A4C6F0] dark:bg-[#0A101D] rounded-bl-3xl rounded-tr-[28px]">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('deep');
                        setUrlError('');
                      }}
                      className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#2A5989] dark:text-slate-300 hover:text-[#183F6B] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Deep scan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('cli');
                        setUrlError('');
                      }}
                      className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#2A5989] dark:text-slate-300 hover:text-[#183F6B] dark:hover:text-white transition-colors cursor-pointer rounded-tr-[28px]"
                    >
                      CLI scan
                    </button>
                  </div>
                </>
              ) : activeTab === 'deep' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('light');
                      setUrlError('');
                    }}
                    className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#2A5989] dark:text-slate-300 hover:text-[#183F6B] dark:hover:text-white transition-colors cursor-pointer bg-[#A4C6F0] dark:bg-[#0A101D] rounded-tl-[28px] rounded-br-2xl"
                  >
                    Light scan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('deep');
                      setUrlError('');
                    }}
                    className="flex-1 py-4 text-center font-semibold text-base sm:text-lg text-[#335F8E] dark:text-cyan-400 bg-[#F3F8FD] dark:bg-[#111827] cursor-pointer"
                  >
                    Deep scan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('cli');
                      setUrlError('');
                    }}
                    className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#2A5989] dark:text-slate-300 hover:text-[#183F6B] dark:hover:text-white transition-colors cursor-pointer bg-[#A4C6F0] dark:bg-[#0A101D] rounded-bl-2xl rounded-tr-[28px]"
                  >
                    CLI scan
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-[2] flex items-stretch bg-[#A4C6F0] dark:bg-[#0A101D] rounded-tl-[28px] rounded-br-3xl">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('light');
                        setUrlError('');
                      }}
                      className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#2A5989] dark:text-slate-300 hover:text-[#183F6B] dark:hover:text-white transition-colors cursor-pointer rounded-tl-[28px]"
                    >
                      Light scan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('deep');
                        setUrlError('');
                      }}
                      className="flex-1 py-4 text-center font-medium text-base sm:text-lg text-[#2A5989] dark:text-slate-300 hover:text-[#183F6B] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Deep scan
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('cli');
                      setUrlError('');
                    }}
                    className="flex-1 py-4 text-center font-semibold text-base sm:text-lg text-[#335F8E] dark:text-cyan-400 bg-[#F3F8FD] dark:bg-[#111827] cursor-pointer rounded-tr-[28px]"
                  >
                    CLI scan
                  </button>
                </>
              )}
            </div>

            {/* ─── Card Body ─── */}
            <div className="p-6 sm:p-8 space-y-6 bg-[#F3F8FD] dark:bg-[#111827]">
              {activeTab !== 'cli' ? (
                <div className="space-y-6">
                  {/* Deep Scan Specific Options */}
                  {activeTab === 'deep' && (
                    <div className="space-y-4">
                      {/* Enable Deep Scans / Light vs Deep Comparison Button */}
                      <button
                        type="button"
                        onClick={() => onOpenComparison(selectedVectorId)}
                        className="hero-compare-btn w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-200 text-base sm:text-lg font-bold flex items-center justify-between transition-all group shadow-sm cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                            <ZapIcon className="w-5 h-5" />
                          </span>
                          <span>
                            Enable Deep Scans:{' '}
                            <strong className="text-slate-900 dark:text-slate-100 font-extrabold">Light vs Deep comparison matrix</strong>
                          </span>
                        </span>
                        <span className="text-base text-cyan-600 dark:text-cyan-300 group-hover:translate-x-1 transition-transform flex items-center gap-1.5 font-bold">
                          View All 8 Categories <span>→</span>
                        </span>
                      </button>

                      {/* Assessment Vector Selector */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[#1E3A8A] dark:text-slate-200 font-bold uppercase tracking-wider text-sm sm:text-base">
                            Assessment Vector (8 Core Categories)
                          </label>
                          <button
                            type="button"
                            onClick={() => onOpenComparison(selectedVectorId)}
                            className="text-[#2563EB] dark:text-cyan-400 hover:underline text-sm sm:text-base font-semibold cursor-pointer"
                          >
                            Compare Checks ↗
                          </button>
                        </div>
                        <div className="relative">
                          <select
                            value={selectedVectorId}
                            onChange={(e) => setSelectedVectorId(e.target.value)}
                            className="hero-select-input w-full py-3.5 px-4 bg-[#F8FAFC] dark:bg-[#0A0E18] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-base font-semibold focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none pr-10"
                          >
                            {scanTaxonomy.map((cat) => (
                              <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1">
                                0{cat.number}. {cat.title} ({cat.tag})
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                            <ChevronDownIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─── Target Input Row (Exact Match to Screenshot) ─── */}
                  <form onSubmit={onLaunchScan} className="space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#385F88] dark:text-slate-300 mb-2">
                        Target
                      </label>
                      <div className="flex items-center rounded-xl border border-[#BDD4EE] dark:border-slate-700 bg-white dark:bg-[#0B0F19] px-4 py-3 shadow-xs focus-within:border-[#7AA7DB] focus-within:ring-2 focus-within:ring-[#7AA7DB]/20 transition-all">
                        {/* Protocol selector */}
                        <div className="relative flex items-center pr-2.5">
                          <select
                            value={protocol}
                            onChange={(e) => setProtocol(e.target.value as 'https' | 'http')}
                            className="appearance-none bg-transparent pr-5 text-sm sm:text-base font-bold text-[#062144] dark:text-slate-100 cursor-pointer focus:outline-none"
                          >
                            <option value="https" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">HTTPS</option>
                            <option value="http" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">HTTP</option>
                          </select>
                          <svg className="w-3.5 h-3.5 text-[#5F7F9F] absolute right-0 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>

                        {/* URL input */}
                        <input
                          type="text"
                          value={targetUrl}
                          onChange={(e) => {
                            setTargetUrl(e.target.value);
                            if (urlError) setUrlError('');
                          }}
                          placeholder="www.example.com"
                          className="flex-1 pl-2.5 bg-transparent text-sm sm:text-base text-[#062144] dark:text-slate-100 placeholder-[#6D91B6] dark:placeholder-slate-500 focus:outline-none"
                        />
                      </div>

                      {urlError && <p className="text-sm sm:text-base text-red-500 mt-2 font-medium">{urlError}</p>}
                    </div>

                    {/* ─── Subtle Full-Width Divider Line (From Screenshot) ─── */}
                    <div className="-mx-6 sm:-mx-8 border-t border-[#DFEBF8] dark:border-slate-800/80 my-6" />

                    {/* ─── Start Scan Button (Exact Match to Screenshot: Yellow + Circular Navy Play Icon) ─── */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#F5B800] hover:bg-[#E5AC00] active:scale-[0.99] text-[#062144] font-bold text-base sm:text-lg transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#062144] flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-[#0080FF] fill-current ml-0.5" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </span>
                      <span>Start scan</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* CLI View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <TerminalIcon className="w-5 h-5 text-cyan-500" />
                      Terminal Command
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyCli}
                      className="inline-flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors cursor-pointer font-medium"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-4 h-4" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-base bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-cyan-300 leading-relaxed">
                    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-800/80 text-slate-400">
                      <span className="w-3 h-3 rounded-full bg-red-500/70" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <span className="w-3 h-3 rounded-full bg-green-500/70" />
                      <span className="ml-2 text-sm text-slate-400">bash terminal</span>
                    </div>
                    <p className="select-all break-all">{cliCommand}</p>
                  </div>

                  <Link
                    href="/dashboard/scans/new"
                    className="w-full py-3.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                  >
                    Configure Advanced Scan Profiles →
                  </Link>
                </div>
              )}
            </div>

            {/* ─── Bottom Footer Bar (Exact Match to Screenshot) ─── */}
            <div className="px-6 sm:px-8 py-4 bg-[#DFECFB] dark:bg-[#0B0F19] border-t border-[#CFE1F6] dark:border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#5A7E9F] dark:text-slate-400 truncate pr-4 font-normal">
                {activeTab === 'light' && 'A light scan with the Website Vulnerability Scanner runs passive...'}
                {activeTab === 'deep' && 'Deep scan crawlers recursively test parameters, endpoints & OWASP Top 10...'}
                {activeTab === 'cli' && 'Headless developer pipeline with instant exit codes for GitHub Actions CI/CD...'}
              </span>
              <button
                type="button"
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="shrink-0 text-[#2B5A8C] dark:text-cyan-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showMoreInfo ? 'SEE LESS' : 'SEE MORE'}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${showMoreInfo ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* Expandable Explanation Drawer */}
            {showMoreInfo && (
              <div className="px-6 sm:px-8 py-4 bg-[#EDF5FE] dark:bg-[#070B14] border-t border-[#CFE1F6] dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 animate-fadeIn">
                <p>
                  <strong className="text-[#062144] dark:text-slate-100">{activeTab === 'light' ? 'Light Scan Scope:' : (activeTab === 'deep' ? 'Deep Scan Scope:' : 'CLI Automation Scope:')}</strong>{' '}
                  {activeTab === 'light' && 'Non-intrusive surface audit evaluating HTTP response headers, missing CSP/HSTS rules, SSL/TLS certificate validity, and exposed credentials without sending active injection attacks.'}
                  {activeTab === 'deep' && 'Comprehensive offensive security audit executing automated crawler spidering, parameter fuzzing, SQLi/XSS/SSRF payload verification, and full Nuclei YAML signature matching.'}
                  {activeTab === 'cli' && 'Integrate automated scans into your local terminal or pre-merge CI/CD checks using our native Docker, Bash, or Python CLI wrapper.'}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenComparison(selectedVectorId)}
                  className="text-[#2B5A8C] dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-1 pt-1"
                >
                  Open Full Capabilities Matrix →
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {children}
    </section>
  );
}

export default HeroSection;
