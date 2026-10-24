'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOL_CATEGORIES, TOOLS_DATA, ToolItem } from './toolsData';

/* ─── Self-Contained SVG Tool Icons ────────────────────────────────────────── */
function ToolSpiderIcon({ className = 'w-7 h-7' }: { className?: string }) {
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

function ToolNetworkIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h3v6.5l6-6.5h3v16h-3v-6.5l-6 6.5h-3z" />
    </svg>
  );
}

function ToolTargetIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ToolEyeIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function ToolTerminalIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function ToolSniperIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="1" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="1" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="23" y2="12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ToolDnsIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function ToolSslIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ToolCloudIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function ToolApiIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 15h3M7 9h3M7 12h2" />
      <path d="M14 9h3M14 15h3M14 12h2" />
    </svg>
  );
}

function ToolZapIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/**
 * Radiating Free Light Badge
 * Placed in top-right of eligible free tool cards.
 */
function FreeLightBadge() {
  return (
    <span
      title="Try the light version for free"
      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-slate-950 shadow-md ring-2 ring-[#0B0F19]"
    >
      <svg className="w-2.5 h-2.5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
    </span>
  );
}

/**
 * Small Shield Icon for Breadcrumb
 */
function ShieldIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function renderToolSvg(type: ToolItem['iconType']) {
  switch (type) {
    case 'spider':
      return <ToolSpiderIcon />;
    case 'network':
      return <ToolNetworkIcon />;
    case 'target':
      return <ToolTargetIcon />;
    case 'eye':
      return <ToolEyeIcon />;
    case 'terminal':
      return <ToolTerminalIcon />;
    case 'sniper':
      return <ToolSniperIcon />;
    case 'dns':
      return <ToolDnsIcon />;
    case 'ssl':
      return <ToolSslIcon />;
    case 'cloud':
      return <ToolCloudIcon />;
    case 'api':
      return <ToolApiIcon />;
    case 'zap':
      return <ToolZapIcon />;
    default:
      return <ToolSpiderIcon />;
  }
}

/**
 * NextToolsSection
 * Replicates the final stage from the screenshot:
 * - 10-step rail on the left (Dash 10 active)
 * - Headline: "Ready for your next step? Try these tools"
 * - Filter tabs (Most used, Recon tools, Vulnerability scanners, Exploit tools)
 * - Tool icon grid with badges
 * - "Try the light version for free" legend
 * - Breadcrumbs
 */
export function NextToolsSection() {
  const [activeCategory, setActiveCategory] = useState<ToolItem['category']>('most-used');

  const filteredTools = TOOLS_DATA.filter((tool) => tool.category === activeCategory);

  return (
    <section id="try-tools" className="relative bg-[#090D16] py-16 sm:py-24 border-t border-slate-800">
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex items-start gap-6 lg:gap-10">
          
          {/* Vertical 10-Step Progress Rail (Dash 10 Active matching Screenshot) */}
          <div className="hidden sm:flex flex-col items-center gap-2.5 pt-4 select-none shrink-0" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i === 9
                    ? 'w-1.5 h-7 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                    : 'w-1 h-3.5 bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            
            {/* Left Column: Headline */}
            <div className="lg:col-span-4 space-y-4 pt-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-normal leading-relaxed">
                <span className="text-gray-150 font-semibold block">Ready for your next</span>
                <span className="text-white font-extrabold block">step? Try these</span>
                <span className="text-white font-extrabold block">tools</span>
              </h2>
            </div>

            {/* Right Column: Large Rounded Card with Tabs & Tool Icons */}
            <div className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
              
              {/* Category Filter Tabs */}
              <div className="bg-[#090D16] rounded-full p-2 border border-slate-800 inline-flex flex-wrap gap-1.5">
                {TOOL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2.5 rounded-full text-base sm:text-lg transition-all cursor-pointer tracking-normal ${
                      activeCategory === cat.id
                        ? 'bg-slate-800 text-white font-bold shadow-sm'
                        : 'text-gray-150 hover:text-white font-medium'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tools Icon Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-start">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="flex flex-col items-center group text-center"
                  >
                    {/* Tool Square Icon Box */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white relative shadow-lg transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-200"
                      style={{ backgroundColor: tool.bgColor }}
                    >
                      {renderToolSvg(tool.iconType)}
                      {tool.hasFreeLightBadge && <FreeLightBadge />}
                    </div>

                    {/* Tool Name Label */}
                    <span className="text-base font-semibold text-gray-150 group-hover:text-cyan-300 transition-colors mt-3 leading-relaxed tracking-normal">
                      {tool.name}
                    </span>
                  </Link>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Legend Below the Grid */}
        <div className="pt-6 sm:pt-8 pl-0 sm:pl-10 flex items-center gap-2.5 text-base text-slate-300 font-medium">
          <span className="w-4 h-4 rounded-full border-2 border-[#10B981] bg-transparent inline-block" />
          <span>Try the light version for free</span>
        </div>

        {/* Breadcrumb Navigation at Bottom */}
        <div className="pt-8 sm:pt-10 pl-0 sm:pl-10 border-t border-slate-800/60 mt-8 flex items-center gap-2.5 text-base text-slate-400 font-mono overflow-x-auto scrollbar-none">
          <ShieldIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <span>›</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap">Vulnerability Scanners</span>
          <span>›</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap">Website Vulnerability Scanners</span>
          <span>›</span>
          <span className="text-slate-200 font-bold whitespace-nowrap">Website Scanner</span>
        </div>

      </div>
    </section>
  );
}
