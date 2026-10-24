'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { api, type GeminiPingResponse, type GeminiStatusResponse, type GeminiGenerateResponse } from '@/lib/api';

const QUICK_PROMPTS = [
  'Explain SSRF vulnerability and best practices to prevent it.',
  'How to secure FastAPI against CORS and header injection?',
  'Remediate SQL injection in an async SQLAlchemy application.',
  'OWASP Top 10 A01: Broken Access Control mitigation checklist.',
];

export interface GeminiProbeCardProps {
  floating?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChatDrawer?: () => void;
}

export function GeminiProbeCard({
  floating = false,
  isOpen = true,
  onClose,
  onOpenChatDrawer,
}: GeminiProbeCardProps) {
  const [status, setStatus] = useState<GeminiStatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Ping state
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<GeminiPingResponse | null>(null);
  const [pingError, setPingError] = useState<string | null>(null);

  // Generate / Inquiry state
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<GeminiGenerateResponse | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Fetch initial status
  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await api.getAiStatus();
      setStatus(res);
    } catch {
      setStatus({ configured: false, model: 'gemini-3.5-flash-lite' });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Ping Gemini endpoint
  const handlePing = async () => {
    setPinging(true);
    setPingError(null);
    setPingResult(null);

    try {
      const result = await api.pingGemini();
      setPingResult(result);
      if (!result.success && !result.configured) {
        setPingError(result.message);
      }
    } catch (err: any) {
      setPingError(err.message || 'Failed to ping Gemini API endpoint');
    } finally {
      setPinging(false);
    }
  };

  // Open full AI chat drawer
  const handleOpenChat = () => {
    if (onOpenChatDrawer) {
      onOpenChatDrawer();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-ai-chat'));
    }
  };

  // Generate AI Response
  const handleGenerate = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const query = customPrompt || prompt;
    if (!query.trim()) return;

    setGenerating(true);
    setGenerateError(null);
    setGenerateResult(null);

    try {
      const result = await api.generateAiResponse({ prompt: query });
      setGenerateResult(result);
      if (!result.success && !result.configured) {
        setGenerateError(result.response);
      }
    } catch (err: any) {
      setGenerateError(err.message || 'Failed to generate AI response');
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  const content = (
    <>
      {/* ─── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/35 flex items-center justify-center text-lg shadow-inner">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-normal leading-relaxed">
                Gemini AI Intelligence
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono tracking-normal">
                google-genai
              </span>
            </div>
            <p className="text-[11.5px] text-slate-300 tracking-normal leading-relaxed">
              Real-time latency probe & security remediation advisor
            </p>
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {loadingStatus ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
              <span>Checking...</span>
            </div>
          ) : status?.configured ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
              <span className="text-slate-400 font-mono text-[11px]">({status.model})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Needs Key</span>
            </div>
          )}

          {/* Open Full Chat Drawer Button */}
          <button
            type="button"
            onClick={handleOpenChat}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60 transition-all flex items-center gap-1.5"
            title="Open Full AI Chat Drawer"
          >
            <span>💬</span>
            <span>Chat</span>
          </button>

          {/* Close or Minimize */}
          {floating ? (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close floating panel"
            >
              ✕
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
              title={isCollapsed ? 'Expand AI Panel' : 'Collapse AI Panel'}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      </div>

      {/* ─── Collapsible Body ───────────────────────────────────── */}
      {!isCollapsed && (
        <div className="divide-y divide-slate-800/80 animate-fadeIn">
          {/* Latency Probe Section */}
          <div className="py-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-100 tracking-normal leading-relaxed flex items-center gap-1.5">
                  <span>⚡</span> Live Model Latency Probe
                </h3>
                <p className="text-[11.5px] text-slate-300 tracking-normal leading-relaxed">
                  FastAPI round-trip benchmark invoking Gemini generate_content.
                </p>
              </div>

              <button
                onClick={handlePing}
                disabled={pinging}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-normal flex items-center justify-center gap-2 transition-all shadow-md shrink-0 ${
                  pinging
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/40 border border-cyan-400/30 active:scale-[0.98]'
                }`}
              >
                {pinging ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Benchmarking...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Ping Gemini Probe</span>
                  </>
                )}
              </button>
            </div>

            {/* Ping Response Output */}
            {pingResult && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        pingResult.success ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'
                      }`}
                    />
                    <span className="font-semibold text-slate-200">
                      {pingResult.success ? 'Probe Verified' : 'Probe Notice'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">· {pingResult.model}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400 text-[11px]">Latency:</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {pingResult.latency_ms} ms
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 tracking-normal leading-relaxed bg-slate-900/90 p-2 rounded border border-slate-800 font-mono whitespace-pre-wrap">
                  {pingResult.message}
                </div>
              </div>
            )}

            {/* Ping Error */}
            {pingError && !pingResult && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 tracking-normal leading-relaxed flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-semibold text-rose-200">Probe Failed</p>
                  <p className="mt-0.5 text-slate-300 text-[11.5px]">{pingError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Remediation Section */}
          <div className="pt-3.5">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-100 tracking-normal leading-relaxed flex items-center gap-1.5 mb-1">
              <span>🛡️</span> Security Intelligence & Remediation Query
            </h3>
            <p className="text-[11.5px] text-slate-300 tracking-normal leading-relaxed mb-2.5">
              Ask Gemini for vulnerability fixes, OWASP Top 10 guidance, or code reviews.
            </p>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-2.5 scrollbar-thin">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(qp);
                    handleGenerate(undefined, qp);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-cyan-300 border border-slate-700/60 transition-colors whitespace-nowrap tracking-normal"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleGenerate} className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about vulnerabilities, remediation code, or scan findings..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 tracking-normal leading-relaxed"
              />
              <button
                type="submit"
                disabled={generating || !prompt.trim()}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-normal flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 ${
                  generating || !prompt.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 border border-emerald-400/30 active:scale-[0.98]'
                }`}
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-emerald-200" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Consulting...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Ask</span>
                  </>
                )}
              </button>
            </form>

            {/* Response Output */}
            {generateResult && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    <span className="font-semibold text-slate-200">Gemini Advisory</span>
                    <span className="text-slate-400 font-mono text-[11px]">· {generateResult.model}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-700">
                    {generateResult.latency_ms} ms
                  </span>
                </div>

                <div className="text-xs text-slate-200 tracking-normal leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 max-h-[220px] overflow-y-auto">
                  {generateResult.response}
                </div>
              </div>
            )}

            {/* Error */}
            {generateError && !generateResult && (
              <div className="mt-2.5 p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 tracking-normal leading-relaxed flex items-start gap-2">
                <span>⚠️</span>
                <p className="text-slate-300 text-[11.5px]">{generateError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (floating) {
    return (
      <div
        className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-[560px] max-w-[calc(100%-2rem)] z-40 max-h-[82vh] overflow-y-auto rounded-2xl border border-cyan-500/35 bg-[#090D16]/98 backdrop-blur-2xl shadow-2xl shadow-black/90 p-4 sm:p-5 scrollbar-thin animate-in fade-in slide-in-from-bottom-3"
        role="dialog"
        aria-label="Gemini AI Security Intelligence Panel"
      >
        {content}
      </div>
    );
  }

  return (
    <Card className="border border-slate-800/80 bg-slate-900/90 shadow-2xl overflow-hidden my-6">
      {content}
    </Card>
  );
}

export default GeminiProbeCard;
