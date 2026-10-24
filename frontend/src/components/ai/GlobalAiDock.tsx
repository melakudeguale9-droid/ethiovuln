'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { GeminiProbeCard } from './GeminiProbeCard';
import { AIChatDrawer } from './AIChatDrawer';

export function GlobalAiDock() {
  const [probeOpen, setProbeOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [quickPinging, setQuickPinging] = useState(false);
  const [quickLatency, setQuickLatency] = useState<number | null>(null);

  const handleQuickPing = async () => {
    setQuickPinging(true);
    try {
      const res = await api.pingGemini();
      if (res && res.latency_ms) {
        setQuickLatency(res.latency_ms);
      }
    } catch {
      // ignore error on quick dock ping
    } finally {
      setQuickPinging(false);
    }
  };

  return (
    <>
      {/* ─── Global Fixed Persistent Floating AI Dock Launcher ─── */}
      <div
        className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-[#0c1324]/95 border border-cyan-500/40 rounded-full px-3.5 py-2 shadow-2xl shadow-cyan-950/70 backdrop-blur-xl transition-all hover:border-cyan-400"
        role="region"
        aria-label="Gemini AI Global Controls"
      >
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80">
          <span className="text-base animate-pulse">✨</span>
          <span className="text-xs font-bold text-white tracking-normal hidden xs:inline">Gemini AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" title="Gemini 3.5 Flash Online" />
        </div>

        {/* Quick Latency Benchmark */}
        <button
          type="button"
          onClick={handleQuickPing}
          disabled={quickPinging}
          className="px-2.5 py-1 rounded-full text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60 transition-all flex items-center gap-1.5"
          title="Run quick Gemini latency benchmark"
        >
          <span>⚡</span>
          <span>{quickLatency ? `${quickLatency}ms` : quickPinging ? '...' : 'Ping'}</span>
        </button>

        {/* Probe Card Toggle */}
        <button
          type="button"
          onClick={() => setProbeOpen((prev) => !prev)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            probeOpen
              ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-400 font-bold'
              : 'text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'
          }`}
          title="Toggle Gemini AI Probe & Query Card"
        >
          <span>🛡️</span>
          <span>{probeOpen ? 'Hide Probe' : 'AI Probe'}</span>
        </button>

        {/* Chat Drawer Toggle */}
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="px-3.5 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-cyan-950 transition-all flex items-center gap-1.5"
          title="Open AI Security Advisor Chat"
        >
          <span>💬</span>
          <span>Chat</span>
        </button>
      </div>

      {/* ─── Persistent Floating Gemini Probe Card ─── */}
      {probeOpen && (
        <GeminiProbeCard
          floating
          isOpen={probeOpen}
          onClose={() => setProbeOpen(false)}
          onOpenChatDrawer={() => {
            setProbeOpen(false);
            setChatOpen(true);
          }}
        />
      )}

      {/* ─── Global Sliding AI Chat Assistant ─── */}
      <AIChatDrawer
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
        hideFloatingTrigger
      />
    </>
  );
}

export default GlobalAiDock;
