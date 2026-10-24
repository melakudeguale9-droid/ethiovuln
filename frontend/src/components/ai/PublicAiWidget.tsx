'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AIChatDrawer } from './AIChatDrawer';

export function PublicAiWidget() {
  const pathname = usePathname();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Listen for global open-ai-chat events
  useEffect(() => {
    const handleOpen = () => setIsAiChatOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  // Do not render on dashboard pages — Dashboard layout uses its own dedicated GlobalAiDock
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <>
      {/* ─── Floating Gemini AI Widget Pill (Always Fixed across all public pages) ─── */}
      {!isAiChatOpen && (
        <button
          type="button"
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-7 right-7 sm:bottom-8 sm:right-8 z-50 flex items-center gap-2.5 bg-[#0c1324]/95 hover:bg-[#111a33] text-white border border-cyan-500/40 hover:border-cyan-400 px-4 py-2.5 rounded-full shadow-2xl shadow-cyan-950/80 hover:shadow-cyan-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md group"
          title="Open Gemini AI Security Advisor"
          aria-label="Open Gemini AI Security Advisor"
        >
          <span className="text-base group-hover:rotate-12 transition-transform duration-300">✨</span>
          <span className="text-sm font-bold tracking-normal text-slate-100 group-hover:text-cyan-300">Gemini AI</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </button>
      )}

      {/* ─── AI Security Assistant Drawer (Gemini 2.5/3.5 Flash) ─── */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onOpenChange={setIsAiChatOpen}
        hideFloatingTrigger
      />
    </>
  );
}

export default PublicAiWidget;
