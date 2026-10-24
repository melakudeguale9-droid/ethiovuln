'use client';

import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

const PRICING_FAQS: FaqItem[] = [
  {
    q: 'What is considered an asset?',
    a: 'An asset is any target hostname, root domain, public IP address, or web application URL that you scan. For example, if you add app.example.com and api.example.com, that counts as 2 assets. You can perform unlimited scans and re-tests on your allocated assets.',
  },
  {
    q: 'How does the free trial work?',
    a: 'You can get started immediately with our Free Edition, which allows you to run light reconnaissance and surface vulnerability audits on your assets. No credit card is required to sign up and begin scanning.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Commercial Bank of Ethiopia (CBE) direct transfers and CBE Birr shortcode payments with instant verification. We also accept international credit/debit cards (Visa, MasterCard, American Express) via Stripe, and Telebirr for local ETB transactions without requiring foreign currency.',
  },
  {
    q: 'How does the 75% AI Pentest discount work?',
    a: 'For our limited launch promotion, all AI Pentest plans (AI Recon Agent at $25/mo, Autonomous AI Pentester at $45/mo, and AI Red Team Swarm at $100/mo) are discounted by 75% for early adopters. The discount applies to both monthly and annual billing cycles.',
  },
  {
    q: 'Can I upgrade, downgrade, or cancel at any time?',
    a: 'Yes, absolutely. You can upgrade your plan or increase your asset quota at any time from your dashboard with prorated billing. You can also cancel your monthly or annual subscription anytime without penalties.',
  },
  {
    q: 'Do you offer custom enterprise deployment for air-gapped networks?',
    a: 'Yes! For banks, government agencies, and regulated institutions, we provide on-premise Docker Compose or Kubernetes deployments that operate inside your private VPC without sending scan telemetry to external clouds.',
  },
];

function ChevronDownIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-normal leading-relaxed mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-150 text-base sm:text-lg font-normal leading-relaxed tracking-normal">
          Everything you need to know about plans, scoping, billing, and assets.
        </p>
      </div>

      <div className="space-y-4">
        {PRICING_FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-[#111827] border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full py-5 px-6 flex items-center justify-between text-left font-bold text-base sm:text-lg text-white hover:text-cyan-400 transition-colors cursor-pointer tracking-normal"
              >
                <span>{faq.q}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-base sm:text-lg text-gray-150 leading-relaxed tracking-normal border-t border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
