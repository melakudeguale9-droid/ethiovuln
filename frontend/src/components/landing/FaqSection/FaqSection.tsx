'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS, FaqItem } from './faqData';

/* ─── Self-Contained SVG Accordion Icons ───────────────────────────────────── */
function PlusCircleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function MinusCircleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

/**
 * FaqAccordionItem
 * Individual accessible expandable card.
 */
interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-[#111827] border-slate-700 shadow-xl'
          : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-start gap-4 text-left transition-colors group cursor-pointer"
      >
        <span className="pt-0.5 shrink-0 text-cyan-400 group-hover:text-cyan-300 transition-colors">
          {isOpen ? (
            <MinusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </span>

        <span className="font-bold text-lg sm:text-xl text-white group-hover:text-cyan-300 transition-colors flex-1 leading-relaxed tracking-normal">
          {item.question}
        </span>
      </button>

      {isOpen && (
        <div
          id={`faq-answer-${item.id}`}
          className="px-5 sm:px-6 pb-6 pt-2 text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal space-y-3.5 border-t border-slate-800"
        >
          {item.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * FaqSection
 * Replicates the Pentest-Tools FAQ section:
 * - 10-step vertical rail on the left (Dash 9 active)
 * - Headline: "Common questions about web vulnerability scanning"
 * - 14 full questions with expand/collapse accordion
 */
export function FaqSection() {
  // First item open by default as shown in the screenshot
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative bg-[#090D16] py-16 sm:py-24 border-t border-slate-800">
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex items-start gap-6 lg:gap-10">
          
          {/* Vertical 10-Step Progress Rail (Dash 9 Active matching Screenshot) */}
          <div className="hidden sm:flex flex-col items-center gap-2.5 pt-4 select-none shrink-0" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i === 8
                    ? 'w-1.5 h-7 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                    : 'w-1 h-3.5 bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            
            {/* Left Column: Headline */}
            <div className="lg:col-span-5 space-y-4 pt-2 lg:sticky lg:top-24">
              <span className="text-base font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block">
                FAQ & Knowledge Base
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-normal leading-relaxed">
                Common questions about web vulnerability scanning
              </h2>

              <p className="text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal pt-2">
                Everything you need to know about scanning methodologies, false positive verification, single-page application crawling, and automated scheduling.
              </p>
            </div>

            {/* Right Column: Accordion List */}
            <div className="lg:col-span-7 space-y-3.5">
              {FAQ_ITEMS.map((item, idx) => (
                <FaqAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openIndex === idx}
                  onToggle={() => handleToggle(idx)}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
