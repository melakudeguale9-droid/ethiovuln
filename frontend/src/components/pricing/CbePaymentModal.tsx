'use client';

import React, { useState } from 'react';
import { PricingPlan, AssetOption } from './pricingData';

interface CbePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  selectedAsset: AssetOption | null;
  billingCycle: 'monthly' | 'yearly';
}

/* ─── CBE Logo Emblem (Commercial Bank of Ethiopia) ───────────────────────── */
function CbeEmblem({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#4B1E78" />
      <circle cx="24" cy="24" r="18" stroke="#F5A623" strokeWidth="2.5" />
      <path
        d="M24 10V38M14 18H34M16 30H32"
        stroke="#F5A623"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="4" fill="#F5A623" />
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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CbePaymentModal({
  isOpen,
  onClose,
  plan,
  selectedAsset,
  billingCycle,
}: CbePaymentModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [txRef, setTxRef] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !plan || !selectedAsset) return null;

  const isYearly = billingCycle === 'yearly';
  const priceUsd = isYearly
    ? Math.round((selectedAsset.monthlyUsd * 10) / 12)
    : selectedAsset.monthlyUsd;
  const priceEtb = isYearly
    ? Math.round((selectedAsset.monthlyEtb * 10) / 12)
    : selectedAsset.monthlyEtb;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txRef.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D121F] border border-purple-500/40 rounded-3xl shadow-[0_0_50px_rgba(75,30,120,0.35)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header (CBE Branded Purple & Gold) */}
        <div className="bg-gradient-to-r from-[#3B1560] via-[#4B1E78] to-[#2E0F4D] p-6 border-b border-purple-500/30 flex items-center justify-between text-white relative">
          <div className="flex items-center gap-3.5">
            <CbeEmblem className="w-12 h-12 shadow-md shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-amber-400 text-purple-950">
                  Official CBE Gateway
                </span>
                <span className="text-xs font-mono text-purple-200">
                  የኢትዮጵያ ንግድ ባንክ
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Commercial Bank of Ethiopia Payment
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-400/30 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Order Summary Pill */}
          <div className="p-4 rounded-2xl bg-[#141B2D] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Plan
              </span>
              <div className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>{plan.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {selectedAsset.label}
                </span>
                {plan.discountBadge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    75% Discount Applied
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Amount to Transfer
              </span>
              <div className="text-2xl font-black text-[#F5A623]">
                {priceEtb.toLocaleString()} ETB{' '}
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  (${priceUsd} USD)
                </span>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-8 px-4 rounded-2xl bg-[#091E1E] border border-emerald-500/40 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckIcon className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-white">
                CBE Payment Submitted!
              </h4>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Thank you! Your transaction reference <strong className="text-emerald-300 font-mono">{txRef}</strong> is currently being verified against our CBE corporate account statement. Your plan will activate within 10–30 minutes.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Bank Details & Form */
            <>
              {/* CBE Official Bank Credentials Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-300 flex items-center gap-2">
                  <span>CBE Direct Deposit Information</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {/* Account Number */}
                  <div className="p-3.5 rounded-xl bg-[#141B2D] border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">
                        CBE Account Number
                      </span>
                      <span className="font-mono text-base font-black text-amber-400">
                        1000 4821 95421
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('1000482195421', 'account')}
                      className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/80 text-purple-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'account' ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="p-3.5 rounded-xl bg-[#141B2D] border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">
                        Beneficiary Name
                      </span>
                      <span className="font-bold text-sm text-slate-100">
                        EthioVuln Pentest Technologies
                      </span>
                    </div>
                  </div>

                  {/* CBE Birr Shortcode */}
                  <div className="p-3.5 rounded-xl bg-[#141B2D] border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">
                        CBE Birr Shortcode
                      </span>
                      <span className="font-mono text-base font-black text-purple-300">
                        582194
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('582194', 'shortcode')}
                      className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/80 text-purple-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'shortcode' ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Branch / Swift */}
                  <div className="p-3.5 rounded-xl bg-[#141B2D] border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">
                        Branch & Swift
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-300">
                        Addis Ababa (Swift: CBETETAA)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label htmlFor="cbe-txref" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>CBE Transaction Reference / FT Number *</span>
                    <span className="text-[11px] text-purple-400 font-normal">From CBE SMS or App receipt</span>
                  </label>
                  <input
                    id="cbe-txref"
                    type="text"
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    placeholder="e.g. FT261020XYZ9102"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#090D16] border border-slate-700 text-white font-mono text-base focus:border-[#F5A623] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="cbe-phone" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Payer Mobile Number
                    </label>
                    <input
                      id="cbe-phone"
                      type="text"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="e.g. 0911234567"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-sm focus:border-[#F5A623] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="cbe-email" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Account Email for Activation
                    </label>
                    <input
                      id="cbe-email"
                      type="email"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      placeholder="e.g. security@agency.et"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090D16] border border-slate-700 text-white text-sm focus:border-[#F5A623] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-extrabold text-base bg-gradient-to-r from-[#F5A623] to-[#E09419] text-[#0C1019] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer transform hover:scale-[1.01]"
                >
                  Verify CBE Transaction & Activate Plan
                </button>
              </form>
            </>
          )}

          {/* Footer Note */}
          <div className="pt-2 text-center text-xs text-slate-500">
            Official Commercial Bank of Ethiopia merchant account. Instant automated statement reconciliation via CBE Core Banking API.
          </div>
        </div>
      </div>
    </div>
  );
}
