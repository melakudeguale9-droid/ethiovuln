'use client';

import React from 'react';
import { PricingCategory, BillingCycle, Currency } from './pricingData';

interface PricingHeroProps {
  category: PricingCategory;
  onSelectCategory: (cat: PricingCategory) => void;
  billingCycle: BillingCycle;
  onToggleBilling: () => void;
  currency: Currency;
  onToggleCurrency: (curr: Currency) => void;
}

export function PricingHero({
  category,
  onSelectCategory,
  billingCycle,
  onToggleBilling,
  currency,
  onToggleCurrency,
}: PricingHeroProps) {
  return (
    <div className="w-full text-center pt-12 pb-8 px-4 sm:px-8 lg:px-14 xl:px-20 max-w-full mx-auto">
      {/* ─── Limited Promo & CBE Payment Announcement Banner ─────────────── */}
      <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-950/70 via-slate-900 to-amber-950/50 border border-purple-500/30 text-xs sm:text-sm text-slate-300 mb-6 shadow-lg shadow-purple-950/20">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-bold text-amber-400">Special Promo: 75% OFF AI Plans</span>
        <span className="text-slate-500">•</span>
        <span className="text-purple-300 font-semibold flex items-center gap-1.5">
          <span>🏦 Pay via CBE (Commercial Bank of Ethiopia)</span>
          <span className="text-xs text-slate-400">or Card</span>
        </span>
      </div>

      {/* ─── Main Heading ───────────────────────────────────────────────────── */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-normal leading-relaxed mb-6">
        Pricing
      </h1>

      {/* ─── Category Pill Switcher (Matching Pentest-Tools Screenshot 1) ──── */}
      <div className="inline-flex p-1.5 rounded-full bg-[#141B2D] border border-slate-800 shadow-inner mb-6 max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectCategory('ai-pentests')}
          className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            category === 'ai-pentests'
              ? 'bg-[#0D121D] text-white shadow-md border border-slate-700/60'
              : 'text-gray-150 hover:text-white'
          }`}
        >
          <span>AI Pentests</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            75% OFF
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory('scanning-validation')}
          className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            category === 'scanning-validation'
              ? 'bg-[#0D121D] text-white shadow-md border border-slate-700/60'
              : 'text-gray-150 hover:text-white'
          }`}
        >
          Scanning & Validation
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory('expert-services')}
          className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            category === 'expert-services'
              ? 'bg-[#0D121D] text-white shadow-md border border-slate-700/60'
              : 'text-gray-150 hover:text-white'
          }`}
        >
          Expert Services
        </button>
      </div>

      {/* ─── Subtitle Description ───────────────────────────────────────────── */}
      <p className="text-gray-150 text-lg sm:text-xl font-normal w-full max-w-full mx-auto leading-relaxed tracking-normal mb-8">
        {category === 'scanning-validation' &&
          'Continuous scanning and deterministic validation for full control over vulnerability testing'}
        {category === 'ai-pentests' &&
          'Autonomous LLM-driven security agents probing, reasoning, and verifying multi-step exploit chains'}
        {category === 'expert-services' &&
          'Human-led penetration testing, code review, and cloud audits executed by certified offensive specialists'}
      </p>

      {/* ─── Billing Cycle & Currency Switcher Row ──────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        
        {/* Monthly / Yearly Toggle (Matching Pentest-Tools Screenshot 1) */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm sm:text-base font-bold cursor-pointer transition-colors ${
              billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'
            }`}
            onClick={billingCycle === 'yearly' ? onToggleBilling : undefined}
          >
            Monthly
          </span>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={billingCycle === 'yearly'}
            onClick={onToggleBilling}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              billingCycle === 'yearly' ? 'bg-[#F5A623]' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>

          <span
            className={`text-sm sm:text-base font-bold cursor-pointer transition-colors ${
              billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'
            }`}
            onClick={billingCycle === 'monthly' ? onToggleBilling : undefined}
          >
            Yearly
          </span>

          {/* Golden Badge (Pay only 10 months / 2 months free) */}
          <span className="text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30">
            Pay only 10 months
          </span>
        </div>

        {/* Currency Switcher (USD / ETB CBE & Telebirr) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141B2D] border border-slate-800 text-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Currency:</span>
          <button
            type="button"
            onClick={() => onToggleCurrency('USD')}
            className={`px-2.5 py-1 rounded font-bold text-xs transition-colors cursor-pointer ${
              currency === 'USD'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            USD ($)
          </button>
          <button
            type="button"
            onClick={() => onToggleCurrency('ETB')}
            className={`px-2.5 py-1 rounded font-bold text-xs transition-colors cursor-pointer ${
              currency === 'ETB'
                ? 'bg-purple-900/40 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ETB (CBE / Telebirr)
          </button>
        </div>

      </div>
    </div>
  );
}
