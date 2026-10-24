'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PricingPlan, AssetOption, BillingCycle, Currency } from './pricingData';
import { CbePaymentModal } from './CbePaymentModal';

interface PricingCardsProps {
  plans: PricingPlan[];
  billingCycle: BillingCycle;
  currency: Currency;
  onScrollToComparison: () => void;
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function InfoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="16" y2="12" />
      <line x1="12" x2="12.01" y1="8" y2="8" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CbeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#4B1E78" />
      <circle cx="12" cy="12" r="8" stroke="#F5A623" strokeWidth="1.5" />
      <path d="M12 6v12M7 10h10M8 15h8" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.75" fill="#F5A623" />
    </svg>
  );
}

export function PricingCards({
  plans,
  billingCycle,
  currency,
  onScrollToComparison,
}: PricingCardsProps) {
  // Track selected asset index per plan
  const [selectedAssetIndices, setSelectedAssetIndices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    plans.forEach((p) => {
      initial[p.id] = p.defaultAssetIndex;
    });
    return initial;
  });

  // Track active asset tooltip
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // CBE Payment Modal state
  const [cbeModalOpen, setCbeModalOpen] = useState(false);
  const [selectedPlanForCbe, setSelectedPlanForCbe] = useState<PricingPlan | null>(null);
  const [selectedAssetForCbe, setSelectedAssetForCbe] = useState<AssetOption | null>(null);

  const handleAssetChange = (planId: string, index: number) => {
    setSelectedAssetIndices((prev) => ({
      ...prev,
      [planId]: index,
    }));
  };

  const handleOpenCbe = (plan: PricingPlan, asset: AssetOption) => {
    setSelectedPlanForCbe(plan);
    setSelectedAssetForCbe(asset);
    setCbeModalOpen(true);
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-8">
      {/* ─── 3-Column Plan Cards Grid (Matching Pentest-Tools Screenshot 1 & 2) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-stretch">
        {plans.map((plan) => {
          const currentAssetIdx = selectedAssetIndices[plan.id] ?? plan.defaultAssetIndex;
          const currentAsset = plan.assetOptions[currentAssetIdx] || plan.assetOptions[0];

          // Annual billing receives a 2-month discount (pay for 10 months out of 12)
          const isYearly = billingCycle === 'yearly';
          const monthlyPriceUsd = isYearly
            ? Math.round((currentAsset.monthlyUsd * 10) / 12)
            : currentAsset.monthlyUsd;
          const monthlyPriceEtb = isYearly
            ? Math.round((currentAsset.monthlyEtb * 10) / 12)
            : currentAsset.monthlyEtb;

          const displayPrice = currency === 'USD' ? `$${monthlyPriceUsd}` : `${monthlyPriceEtb.toLocaleString()} ETB`;
          const annualTotal = currency === 'USD' ? `$${currentAsset.monthlyUsd * 10}/yr` : `${(currentAsset.monthlyEtb * 10).toLocaleString()} ETB/yr`;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${plan.isPopular
                  ? 'bg-[#111827] border-2 border-[#F5A623] shadow-2xl lg:-translate-y-2'
                  : 'bg-[#0F172A] border border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F5A623] text-[#0C1019] text-xs font-black uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              {/* ─── Top Segment: Header, Price & Dropdown ────────────────── */}
              <div className="p-6 sm:p-8 border-b border-slate-800/80">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {plan.name}
                  </h3>
                  {plan.discountBadge && (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                      {plan.discountBadge}
                    </span>
                  )}
                </div>

                <p className="text-gray-150 text-base min-h-[44px] leading-relaxed tracking-normal mb-5">
                  {plan.tagline}
                </p>

                {/* Price Display with Strikethrough Discount */}
                <div className="flex flex-col mb-3">
                  {currentAsset.originalUsd && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500 line-through text-base sm:text-lg font-bold">
                        {currency === 'USD'
                          ? `$${isYearly ? Math.round((currentAsset.originalUsd * 10) / 12) : currentAsset.originalUsd}`
                          : `${(isYearly ? Math.round((currentAsset.originalUsd * 128 * 10) / 12) : currentAsset.originalUsd * 128).toLocaleString()} ETB`}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        (Save 75%)
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-normal">
                      {displayPrice}
                    </span>
                    <span className="text-slate-400 font-semibold text-base sm:text-lg">
                      /month
                    </span>
                  </div>
                </div>

                {isYearly && (
                  <p className="text-xs font-bold text-[#F5A623] mb-4">
                    Billed annually at {annualTotal} (Save ~17%)
                  </p>
                )}

                {/* Asset Dropdown Selector */}
                <div className="mt-4 mb-6 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Scope / Assets:
                    </label>

                    {/* Info Tooltip */}
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="What is an asset?"
                        onMouseEnter={() => setActiveTooltip(plan.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <InfoIcon className="w-4 h-4" />
                      </button>

                      {activeTooltip === plan.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-64 p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 shadow-2xl z-50 animate-in fade-in">
                          <p className="font-bold text-white mb-1">What is an asset?</p>
                          An asset is a target hostname, root domain, IP address, or web application URL that you assess.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={currentAssetIdx}
                      onChange={(e) => handleAssetChange(plan.id, Number(e.target.value))}
                      className="w-full appearance-none px-4 py-3 rounded-xl bg-[#141B2D] border border-slate-700/80 text-white font-bold text-base focus:outline-none focus:border-[#F5A623] cursor-pointer"
                    >
                      {plan.assetOptions.map((opt, idx) => (
                        <option key={idx} value={idx} className="bg-slate-900 text-white">
                          {opt.label} — {currency === 'USD' ? `$${isYearly ? Math.round((opt.monthlyUsd * 10) / 12) : opt.monthlyUsd}/mo` : `${isYearly ? Math.round((opt.monthlyEtb * 10) / 12).toLocaleString() : opt.monthlyEtb.toLocaleString()} ETB/mo`}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Primary CTA Button (Standard Card / Checkout Option) */}
                <Link
                  href={plan.buttonHref}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-base sm:text-lg text-[#0C1019] bg-[#F5A623] hover:bg-[#E09419] shadow-md shadow-orange-500/20 text-center block transition-all transform hover:scale-[1.01]"
                >
                  {plan.buttonLabel}
                </Link>

                {/* Dedicated CBE Payment Button */}
                <button
                  type="button"
                  onClick={() => handleOpenCbe(plan, currentAsset)}
                  className="w-full mt-2.5 py-3 px-4 rounded-xl font-bold text-sm sm:text-base text-amber-300 bg-gradient-to-r from-[#3B1560] via-[#4B1E78] to-[#2E0F4D] hover:from-[#4B1E78] hover:to-[#5E2796] border border-amber-500/40 hover:border-amber-400 shadow-md shadow-purple-950/40 text-center flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <CbeIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Pay via CBE (Commercial Bank of Ethiopia)</span>
                </button>

                {/* Accepted Payment Options Pill Badges */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5 text-xs">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mr-1">
                    Accepted:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-semibold flex items-center gap-1">
                    💳 Card
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-950/70 text-amber-300 border border-purple-500/40 font-semibold flex items-center gap-1">
                    🏦 CBE (ንግድ ባንክ)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700/60 font-semibold flex items-center gap-1">
                    📱 Telebirr
                  </span>
                </div>
              </div>

              {/* ─── Bottom Segment: Features Checklist (Screenshot 2) ────── */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-start">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                  {plan.whatsIncludedTitle || "What's included:"}
                </h4>

                <ul className="space-y-3.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-200">
                      <span className="p-0.5 rounded-full bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
                        <CheckIcon className="w-4 h-4" />
                      </span>
                      <span className="text-gray-150 leading-relaxed tracking-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Bottom Link to Comparison Matrix (Screenshot 2) ────────────────── */}
      <div className="text-center mt-10">
        <button
          type="button"
          onClick={onScrollToComparison}
          className="inline-flex items-center gap-2 text-base font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-all cursor-pointer"
        >
          <span>See price per asset breakdown</span>
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* ─── Commercial Bank of Ethiopia (CBE) Payment Modal ────────────────── */}
      <CbePaymentModal
        isOpen={cbeModalOpen}
        onClose={() => setCbeModalOpen(false)}
        plan={selectedPlanForCbe}
        selectedAsset={selectedAssetForCbe}
        billingCycle={billingCycle}
      />
    </div>
  );
}

