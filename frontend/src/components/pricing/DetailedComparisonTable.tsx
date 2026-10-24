'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { COMPARISON_CATEGORIES } from './pricingData';

function CheckIcon({ className = 'w-4 h-4 text-cyan-400' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MinusIcon({ className = 'w-4 h-4 text-slate-500' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function InfoIcon({ className = 'w-3.5 h-3.5 text-slate-400' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function DetailedComparisonTable() {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (title: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderValue = (val: string | boolean) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400">
          <CheckIcon className="w-4 h-4" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center text-slate-600">
          <MinusIcon className="w-4 h-4" />
        </span>
      );
    }
    return (
      <span className="text-xs sm:text-sm font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 capitalize">
        {val}
      </span>
    );
  };

  return (
    <div id="compare-plans" className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16">
      {/* ─── Section Header (Screenshot 4) ─────────────────────────────────── */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-normal leading-relaxed mb-4">
          A detailed view of our plans
        </h2>
        <p className="text-gray-150 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed tracking-normal">
          Let&apos;s make it easy for you to choose the best plan for your security workflow.
        </p>
      </div>

      {/* ─── Comparison Table Container (Screenshot 5) ────────────────────── */}
      <div className="rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[800px]">
            {/* Table Header with CTA Buttons */}
            <thead>
              <tr className="border-b border-slate-800 bg-[#0F172A]">
                <th className="py-6 px-6 text-base font-extrabold text-white w-2/5">
                  Plans Overview
                </th>

                {/* Free Plan Column */}
                <th className="py-6 px-4 text-center w-[15%]">
                  <div className="font-extrabold text-xl text-white mb-3">Free</div>
                  <Link
                    href="/register"
                    className="inline-block py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold bg-[#1C2538] hover:bg-[#25324C] text-slate-200 transition-colors border border-slate-700 whitespace-nowrap"
                  >
                    Select Free Edition
                  </Link>
                </th>

                {/* NetScan Column */}
                <th className="py-6 px-4 text-center w-[15%]">
                  <div className="font-extrabold text-xl text-white mb-3">NetScan</div>
                  <Link
                    href="/dashboard/scans/new?plan=netscan"
                    className="inline-block py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-extrabold bg-[#F5A623] hover:bg-[#E09419] text-[#0C1019] transition-all shadow-sm whitespace-nowrap"
                  >
                    Select NetScan
                  </Link>
                </th>

                {/* AppScan Column */}
                <th className="py-6 px-4 text-center w-[15%] bg-[#151E33]/60">
                  <div className="font-extrabold text-xl text-white mb-3 flex items-center justify-center gap-1.5">
                    <span>AppScan</span>
                    <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                  </div>
                  <Link
                    href="/dashboard/scans/new?plan=appscan"
                    className="inline-block py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-extrabold bg-[#F5A623] hover:bg-[#E09419] text-[#0C1019] transition-all shadow-sm whitespace-nowrap"
                  >
                    Select AppScan
                  </Link>
                </th>

                {/* Exploit Column */}
                <th className="py-6 px-4 text-center w-[15%]">
                  <div className="font-extrabold text-xl text-white mb-3">Exploit</div>
                  <Link
                    href="/dashboard/scans/new?plan=exploit"
                    className="inline-block py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-extrabold bg-[#F5A623] hover:bg-[#E09419] text-[#0C1019] transition-all shadow-sm whitespace-nowrap"
                  >
                    Select Exploit
                  </Link>
                </th>
              </tr>
            </thead>

            {/* Table Categories and Feature Rows */}
            <tbody className="divide-y divide-slate-800/60">
              {COMPARISON_CATEGORIES.map((category) => {
                const isCollapsed = collapsedCategories[category.title];

                return (
                  <React.Fragment key={category.title}>
                    {/* Category Title Header Bar */}
                    <tr
                      onClick={() => toggleCategory(category.title)}
                      className="bg-[#161F36] hover:bg-[#1C2744] transition-colors cursor-pointer"
                    >
                      <td colSpan={5} className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                            {category.title}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                            {category.count}
                          </span>
                          <InfoIcon className="w-4 h-4 text-slate-500" />
                          <span className="ml-auto text-xs font-bold text-slate-400">
                            {isCollapsed ? '▼ Expand' : '▲ Collapse'}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Category Items Rows */}
                    {!isCollapsed &&
                      category.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-800/30 transition-colors group text-sm sm:text-base"
                        >
                          {/* Feature Name */}
                          <td className="py-3.5 px-6 font-medium text-slate-200">
                            {item.name}
                          </td>

                          {/* Free */}
                          <td className="py-3.5 px-4 text-center">
                            {renderValue(item.free)}
                          </td>

                          {/* NetScan */}
                          <td className="py-3.5 px-4 text-center">
                            {renderValue(item.netscan)}
                          </td>

                          {/* AppScan */}
                          <td className="py-3.5 px-4 text-center bg-[#151E33]/30">
                            {renderValue(item.appscan)}
                          </td>

                          {/* Exploit */}
                          <td className="py-3.5 px-4 text-center">
                            {renderValue(item.exploit)}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
