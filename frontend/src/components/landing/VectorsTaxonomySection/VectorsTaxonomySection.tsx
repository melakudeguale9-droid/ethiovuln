'use client';

import React from 'react';
import Link from 'next/link';
import { SCAN_TAXONOMY } from '@/data/scanTaxonomy';

interface VectorsTaxonomySectionProps {
  onOpenComparisonModal: () => void;
}

function ArrowRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function VectorsTaxonomySection({ onOpenComparisonModal }: VectorsTaxonomySectionProps) {
  return (
    <section id="features" className="py-24 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full border-t border-slate-800/60 font-sans">
      <div className="text-center mb-16">
        <span className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full inline-block">
          Scan Taxonomy
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5 tracking-normal leading-relaxed">
          8 Assessment Vectors &amp; Coverage
        </h2>
        <p className="text-gray-150 text-lg sm:text-xl mt-4 w-full max-w-full mx-auto leading-relaxed tracking-normal font-normal">
          Systematic active injection, passive telemetry audits, container inspection, and API security organized into standardized tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SCAN_TAXONOMY.map((cat) => {
          const totalChecks = cat.subCategories.reduce(
            (acc, sub) => acc + sub.checks.length,
            0
          );

          return (
            <Link
              key={cat.id}
              href={`/dashboard/scans/new?mode=${cat.id}`}
              className="p-7 rounded-2xl bg-[#111827] border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_20px_rgba(0,240,255,0.12)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <span
                    className="text-base font-bold uppercase tracking-wider px-3.5 py-1.5 rounded border"
                    style={{
                      borderColor: `${cat.color}40`,
                      color: cat.color,
                      backgroundColor: `${cat.color}15`,
                    }}
                  >
                    {cat.tag}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2.5 group-hover:text-cyan-300 transition-colors">
                  0{cat.number}. {cat.title}
                </h3>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-base">
                <span className="text-slate-300 font-mono text-base font-medium">
                  {cat.subCategories.length} Modules · {totalChecks} Checks
                </span>
                <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                  Launch →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Capability Comparison Callout */}
      <div className="mt-14 p-8 sm:p-10 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2 max-w-3xl">
          <h4 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center justify-center sm:justify-start gap-3">
            <span className="text-3xl">🛡️</span>
            <span>Need a detailed capability breakdown for compliance or scoping?</span>
          </h4>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
            Explore the exact check-by-check breakdown between Light Scan surface audits and Deep Scan active exploit verification.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenComparisonModal}
          className="shrink-0 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-base sm:text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 cursor-pointer"
        >
          <span>Open Full Comparison Matrix</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
