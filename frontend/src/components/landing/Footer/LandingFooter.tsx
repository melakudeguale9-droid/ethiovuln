'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';
import {
  FOOTER_ROW_1,
  FOOTER_ROW_2,
  TRUST_BADGES,
  TrustBadgeItem,
} from './footerData';

/* ─── Self-Contained Inline SVG Icons ──────────────────────────────────────── */
function ShieldIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function TelegramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.222-.524.222l.213-3.05 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
    </svg>
  );
}

function MailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

/**
 * Trust Badge Graphics (Curated for EthioVuln Security Platform)
 */
function renderTrustLogo(type: TrustBadgeItem['badgeType']) {
  switch (type) {
    case 'insa':
      return (
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3.5 py-1.5 bg-[#0F172A] border border-cyan-500/40 rounded-lg text-left font-mono">
            <span className="text-base font-bold text-white tracking-wide">INSA</span>
            <span className="block text-sm font-semibold text-cyan-400">Cyber Talent</span>
          </div>
        </div>
      );
    case 'owasp':
      return (
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3.5 py-1.5 bg-[#0F172A] border border-amber-500/40 rounded-lg text-left font-mono">
            <span className="text-base font-bold text-amber-300 tracking-wide">OWASP / CVSS</span>
            <span className="block text-sm font-semibold text-slate-300">v3.1 Standard</span>
          </div>
        </div>
      );
    case 'engine':
      return (
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3.5 py-1.5 bg-[#0F172A] border border-indigo-500/40 rounded-lg text-left font-mono">
            <span className="text-base font-bold text-indigo-300 tracking-wide">Tri-Engine</span>
            <span className="block text-sm font-semibold text-slate-300">DAST Core</span>
          </div>
        </div>
      );
    case 'research':
      return (
        <div className="flex items-center gap-2 mb-3">
          <div className="px-3.5 py-1.5 bg-[#0F172A] border border-emerald-500/40 rounded-lg text-left font-mono">
            <span className="text-base font-bold text-emerald-300 tracking-wide">Cyber Defense</span>
            <span className="block text-sm font-semibold text-slate-300">Security Research</span>
          </div>
        </div>
      );
  }
}

/**
 * Global EthioVuln Application Footer
 */
export function LandingFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-[#080C14] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 font-sans">
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20">

        {/* ─── Breadcrumbs Line ────────────────────────────────────────────── */}
        <div className="pb-12 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-base sm:text-lg font-mono text-slate-300">
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none">
            <ShieldIcon className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>›</span>
            <Link href="/" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              EthioVuln Platform
            </Link>
            <span>›</span>
            <Link href="/about" className="hover:text-cyan-400 transition-colors whitespace-nowrap">
              Security Architecture
            </Link>
            <span>›</span>
            <span className="text-slate-100 font-extrabold whitespace-nowrap">Vulnerability Assessment</span>
          </div>

          <div className="text-slate-300 text-base sm:text-lg whitespace-nowrap font-medium">
            Active Security Telemetry · October 2026
          </div>
        </div>

        {/* ─── Link Columns: Row 1 ──────────────────────────────────────────── */}
        <div className="py-14 border-b border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {FOOTER_ROW_1.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-slate-100 font-mono">
                {col.title}
              </h4>
              <ul className="space-y-3 text-base sm:text-lg">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-slate-200 hover:text-cyan-400 transition-colors block py-1 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Link Columns: Row 2 ──────────────────────────────────────────── */}
        <div className="py-14 border-b border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {FOOTER_ROW_2.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-slate-100 font-mono">
                {col.title}
              </h4>
              <ul className="space-y-3 text-base sm:text-lg">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.href.startsWith('http') || link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-slate-200 hover:text-cyan-400 transition-colors block py-1 leading-relaxed font-medium"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-slate-200 hover:text-cyan-400 transition-colors block py-1 leading-relaxed font-medium"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Newsletter / Threat Advisory Subscription Row ───────────────── */}
        <div className="py-14 border-b border-slate-800/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <h4 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-slate-100">
              Stay Ahead of Emerging Web Vulnerabilities
            </h4>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
              Subscribe to EthioVuln threat telemetry notifications, CVE impact writeups, and automated remediation blueprints.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex items-center max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your security email"
              required
              aria-label="Email address for security updates"
              className="w-full sm:w-80 bg-[#101522] border border-slate-700/80 rounded-l-xl px-5 py-4 text-base sm:text-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-7 py-4 rounded-r-xl text-base sm:text-lg shrink-0 transition-colors shadow-md cursor-pointer"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* ─── Copyright & Verified Social Links Row ─────────────────────────── */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-base sm:text-lg text-slate-300 border-b border-slate-800/60 font-medium">
          <div>
            © 2024-2026 EthioVuln — Automated Web Application Vulnerability Scanner
          </div>

          <div className="flex items-center gap-3.5">
            <a
              href={SOCIAL_LINKS.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram Channel"
              title="Telegram: @melakucyber"
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <TelegramIcon className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.github.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              title="GitHub: melakudeguale9-droid/ethiovuln"
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn: Melaku Deguale"
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a
              href="mailto:security@ethiovuln.io"
              aria-label="Email Security Team"
              title="Email: security@ethiovuln.io"
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <MailIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* ─── 4 Security Standards & Trust Cards Row ───────────────────────── */}
        <div className="py-12 border-b border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.id} className="space-y-3">
              {renderTrustLogo(badge.badgeType)}
              <h5 className="text-lg font-bold text-slate-100 leading-snug">
                {badge.title}
              </h5>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Bottom Operational Status Indicator ──────────────────────────── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-semibold text-base">All scanning engines operational</span>
          </div>

          <div className="text-base text-slate-400 font-mono font-medium text-center sm:text-right">
            Platform Engine v1.0 · INSA Cyber Talent Center · Melaku Deguale (Cyber Security Student &amp; Security Researcher)
          </div>
        </div>

      </div>
    </footer>
  );
}
