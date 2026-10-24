'use client';

import React from 'react';

export interface MatrixFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onlyDeepExclusive: boolean;
  onToggleDeepExclusive: (val: boolean) => void;
  totalChecks: number;
  filteredChecksCount: number;
}

export function MatrixFilters({
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  onSelectCategory,
  onlyDeepExclusive,
  onToggleDeepExclusive,
  totalChecks,
  filteredChecksCount,
}: MatrixFiltersProps) {
  return (
    <div className="px-7 py-4.5 bg-[#0F172A] border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-lg">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search checks, CVEs, OWASP, SQLi, SSRF, headers..."
          className="w-full pl-12 pr-10 py-3 bg-[#090D16] border border-slate-800 rounded-xl text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-100 text-base font-bold"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Controls & Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Reset / All Filter */}
        {selectedCategoryId !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="px-4 py-2.5 rounded-xl text-base font-semibold bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2"
          >
            <span>✕ Clear Focus</span>
          </button>
        )}

        {/* Deep Scan Exclusives Only Toggle */}
        <button
          type="button"
          onClick={() => onToggleDeepExclusive(!onlyDeepExclusive)}
          className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-all border flex items-center gap-2.5 ${
            onlyDeepExclusive
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-[#090D16] text-slate-300 hover:text-slate-100 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              onlyDeepExclusive ? 'bg-amber-400' : 'bg-slate-600'
            }`}
          />
          <span>Deep Scan Exclusives Only</span>
        </button>

        {/* Results Counter Pill */}
        <span className="text-base font-medium text-slate-300 px-4 py-2.5 rounded-xl bg-[#090D16] border border-slate-800">
          Showing <strong className="text-slate-100">{filteredChecksCount}</strong> of{' '}
          {totalChecks} checks
        </span>
      </div>
    </div>
  );
}
