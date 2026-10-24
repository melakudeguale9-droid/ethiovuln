'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { LandingFooter } from '@/components/landing/Footer';
import {
  PricingCategory,
  BillingCycle,
  Currency,
  SCANNING_VALIDATION_PLANS,
  AI_PENTEST_PLANS,
  EXPERT_SERVICES_PLANS,
} from '@/components/pricing/pricingData';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingCards } from '@/components/pricing/PricingCards';
import { AllPlansIncluded } from '@/components/pricing/AllPlansIncluded';
import { EnterpriseBanner } from '@/components/pricing/EnterpriseBanner';
import { DetailedComparisonTable } from '@/components/pricing/DetailedComparisonTable';
import { PricingFaq } from '@/components/pricing/PricingFaq';

export default function PricingPage() {
  const [category, setCategory] = useState<PricingCategory>('ai-pentests');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Select active plans according to the selected tab
  const activePlans =
    category === 'scanning-validation'
      ? SCANNING_VALIDATION_PLANS
      : category === 'ai-pentests'
      ? AI_PENTEST_PLANS
      : EXPERT_SERVICES_PLANS;

  const scrollToComparison = () => {
    const el = document.getElementById('compare-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-cyan-500/25 selection:text-cyan-200 w-full max-w-full overflow-x-hidden min-w-0">
      {/* ─── Global Navbar ─────────────────────────────────────────────────── */}
      <Navbar />

      {/* ─── Hero Section with Tabs & Toggles ───────────────────────────────── */}
      <PricingHero
        category={category}
        onSelectCategory={setCategory}
        billingCycle={billingCycle}
        onToggleBilling={() =>
          setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))
        }
        currency={currency}
        onToggleCurrency={setCurrency}
      />

      {/* ─── 3 Tier Cards (NetScan, AppScan, Exploit) ───────────────────────── */}
      <PricingCards
        plans={activePlans}
        billingCycle={billingCycle}
        currency={currency}
        onScrollToComparison={scrollToComparison}
      />

      {/* ─── Included in All Plans & Optional Add-ons Box ──────────────────── */}
      <AllPlansIncluded />

      {/* ─── Custom Plans Enterprise Banner ─────────────────────────────────── */}
      <EnterpriseBanner />

      {/* ─── Detailed Feature Comparison Matrix Table ───────────────────────── */}
      <DetailedComparisonTable />

      {/* ─── Pricing FAQs ───────────────────────────────────────────────────── */}
      <PricingFaq />

      {/* ─── Global Footer ──────────────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
}
