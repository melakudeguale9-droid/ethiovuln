'use client';

import React from 'react';
import type { ScanCategoryData, ComparisonCheckItem } from './scanCategoriesData';
import styles from './ScanMatrixModal.module.css';

export interface MatrixComparisonTableProps {
  categories: ScanCategoryData[];
}

export function MatrixComparisonTable({ categories }: MatrixComparisonTableProps) {
  if (categories.length === 0) {
    return (
      <div className="py-20 text-center bg-[#090D16]">
        <span className="text-5xl mb-3 block">🔍</span>
        <h4 className="text-xl font-bold text-slate-100 mb-2">
          No matching security checks found
        </h4>
        <p className="text-base text-slate-400">
          Try broadening your search term or clearing the active category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#090D16]">
      {/* ─── Sticky Table Column Headers ─────────────────────────────────── */}
      <div className="sticky top-0 z-20 grid grid-cols-12 gap-5 px-7 py-4.5 bg-[#0F172A] border-b border-slate-800 text-base font-bold uppercase tracking-wider text-slate-200 shadow-md">
        <div className="col-span-12 md:col-span-6 flex items-center gap-2.5">
          <span>🛡️ Testing Areas & Security Checks</span>
        </div>

        <div className="col-span-6 md:col-span-3 flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span>Light Scan (Surface)</span>
        </div>

        <div className="col-span-6 md:col-span-3 flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-slate-100">Deep Scan (Exploit Proof)</span>
        </div>
      </div>

      {/* ─── Category Sections & Items ───────────────────────────────────── */}
      <div className="divide-y divide-slate-800">
        {categories.map((cat) => (
          <div key={cat.id} className="w-full">
            {/* Category Header Row */}
            <div className="px-7 py-5 bg-[#0F172A] border-t border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl" aria-hidden="true">
                  {cat.icon}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="font-mono font-bold text-base"
                      style={{ color: cat.color }}
                    >
                      0{cat.number}.
                    </span>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-slate-100">
                      {cat.title}
                    </h3>
                    <span
                      className="text-base font-semibold px-3 py-1 rounded-md border"
                      style={{
                        backgroundColor: cat.accentBg,
                        color: cat.color,
                        borderColor: `${cat.color}40`,
                      }}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-base text-slate-300 mt-1 leading-relaxed">
                    {cat.summary}
                  </p>
                </div>
              </div>

              <div className="text-base font-semibold text-slate-300 px-4 py-1.5 rounded-lg bg-[#090D16] border border-slate-800">
                Engine: <span style={{ color: cat.color }}>{cat.backendEngine}</span>
              </div>
            </div>

            {/* Check Items in Category */}
            <div className="divide-y divide-slate-800/80">
              {cat.items.map((item: ComparisonCheckItem) => (
                <div
                  key={item.code}
                  className={`${styles.tableRow} grid grid-cols-12 gap-5 px-7 py-6 items-start`}
                >
                  {/* Left Column: Check Details */}
                  <div className="col-span-12 md:col-span-6 space-y-2.5 pr-0 md:pr-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-bold text-base px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {item.code}
                      </span>
                      <h4 className="font-bold text-lg text-slate-100">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-base text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {/* Severity Pill */}
                      <span
                        className={`text-base font-semibold px-3 py-1 rounded-md border ${item.severity === 'Critical'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : item.severity === 'High'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : item.severity === 'Medium'
                                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                : item.severity === 'Low'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          }`}
                      >
                        {item.severity}
                      </span>

                      {/* CWE Tag */}
                      {item.cwe && (
                        <span className="text-base font-mono px-3 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                          {item.cwe}
                        </span>
                      )}

                      {/* Engine Tag */}
                      <span className="text-base text-slate-400 flex items-center gap-1.5">
                        <span>⚙️</span>
                        <span>{item.engine}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Light Scan Capabilities */}
                  <div className="col-span-6 md:col-span-3 space-y-2 pt-1 md:pt-0">
                    <div className="flex items-center gap-2.5">
                      {item.lightSupported ? (
                        <>
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-base font-bold flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-base font-bold text-emerald-400">
                            Included in Light
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center text-base font-bold flex-shrink-0">
                            —
                          </span>
                          <span className="text-base font-medium text-slate-500">
                            Deep Scan Only
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-base text-slate-400 leading-relaxed pl-8">
                      {item.lightNote}
                    </p>
                  </div>

                  {/* Right Column: Deep Scan Capabilities */}
                  <div className="col-span-6 md:col-span-3 space-y-2 pt-1 md:pt-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-base font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-base font-bold text-amber-300">
                        Deep Exploit Proof
                      </span>
                    </div>

                    <p className="text-base text-slate-200 leading-relaxed pl-8">
                      {item.deepNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
