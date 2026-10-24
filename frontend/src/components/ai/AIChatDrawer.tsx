'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { api, type ChatMessage } from '@/lib/api';
import styles from './AIChatDrawer.module.css';

interface DisplayMessage extends ChatMessage {
  id: string;
  timestamp: string;
  latency_ms?: number;
}

const STARTER_PROMPTS = [
  'Explain SQL Injection and show safe parameterized query examples.',
  'How do I mitigate Server-Side Request Forgery (SSRF) in microservices?',
  'Best practices for Content Security Policy (CSP) & cookie hardening.',
  'Remediate Broken Object Level Authorization (BOLA / IDOR).',
];

export interface AIChatDrawerProps {
  initialOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideFloatingTrigger?: boolean;
  context?: string;
}

export function AIChatDrawer({
  initialOpen = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  hideFloatingTrigger = false,
  context,
}: AIChatDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(initialOpen);
  const isControlled = typeof controlledIsOpen === 'boolean';
  const drawerOpen = isControlled ? controlledIsOpen : internalOpen;

  const setDrawerOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [drawerPinging, setDrawerPinging] = useState(false);
  const [drawerLatency, setDrawerLatency] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (drawerOpen) {
      scrollToBottom();
      textareaRef.current?.focus();
    }
  }, [messages, drawerOpen]);

  // Handle ESC key to close drawer, and custom event to open drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    const handleOpenChat = () => {
      setDrawerOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-ai-chat', handleOpenChat);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-ai-chat', handleOpenChat);
    };
  }, [drawerOpen, setDrawerOpen]);

  // Copy code snippet helper
  const copyCode = (codeText: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  // Send message to Gemini /api/ai/chat
  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsSending(true);

    try {
      // Build request payload for backend
      const apiPayload = {
        messages: newHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        context,
      };

      const result = await api.chatWithAi(apiPayload);

      const modelMsg: DisplayMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency_ms: result.latency_ms,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: DisplayMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: `⚠️ Failed to get AI response: ${err.message || 'Please ensure you are logged in and backend is running.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Handle textarea enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render message content with markdown-like code block highlighting
  const renderFormattedContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].trim().match(/^[a-zA-Z0-9_-]+$/) ? lines[0].trim() : '';
        const codeText = language ? lines.slice(1).join('\n') : lines.join('\n');
        const snippetId = `${msgId}-code-${index}`;

        return (
          <div
            key={index}
            className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/95 font-mono text-xs shadow-inner"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-cyan-400">{language || 'code'}</span>
              <button
                type="button"
                onClick={() => copyCode(codeText, snippetId)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCodeId === snippetId ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <pre className="p-3 text-slate-100 overflow-x-auto whitespace-pre font-mono leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format bold text
      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed tracking-normal">
          {part}
        </span>
      );
    });
  };

  return (
    <>
      {/* ─── Floating Trigger Button (Shown if not controlled or hidden) ── */}
      {!hideFloatingTrigger && !drawerOpen && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={styles.floatingTrigger}
          title="Open AI Security Advisor Chat"
        >
          <span className={styles.floatingIcon}>✨</span>
          <span>AI Advisor</span>
          <span className={styles.floatingBadge}>Gemini</span>
        </button>
      )}

      {/* ─── Sliding Chat Drawer ─────────────────────────────── */}
      {drawerOpen && (
        <div className={styles.backdrop} onClick={() => setDrawerOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.avatar}>✨</div>
                <div className={styles.titleText}>
                  <div className={styles.title}>
                    <span>EthioVuln AI Advisor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={styles.statusTag}>
                      <span className={styles.statusDot} />
                      <span>Online</span>
                    </span>
                    <span className={styles.modelBadge}>· Gemini 3.5 Flash</span>
                  </div>
                </div>
              </div>

              <div className={styles.headerActions}>
                {/* 1-Click Latency Benchmark Probe */}
                <button
                  type="button"
                  onClick={async () => {
                    setDrawerPinging(true);
                    try {
                      const res = await api.pingGemini();
                      if (res && res.latency_ms) {
                        setDrawerLatency(res.latency_ms);
                      }
                    } catch {
                      // ignore
                    } finally {
                      setDrawerPinging(false);
                    }
                  }}
                  disabled={drawerPinging}
                  className={styles.actionBtn}
                  title="Run live round-trip latency probe to Gemini"
                >
                  <span>⚡</span>
                  <span>{drawerLatency ? `${drawerLatency}ms` : drawerPinging ? '...' : 'Ping Probe'}</span>
                </button>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className={styles.actionBtn}
                    title="Clear Conversation History"
                  >
                    <span>🗑️</span>
                    <span>Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className={styles.closeBtn}
                  title="Close Assistant (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conversation Window */}
            <div className={styles.messageArea}>
              {messages.length === 0 ? (
                <div className={styles.starterBox}>
                  <div className={styles.starterIcon}>🛡️</div>
                  <h3 className={styles.starterTitle}>How can I assist your security review?</h3>
                  <p className={styles.starterSubtitle}>
                    Ask me anything about web vulnerabilities, OWASP Top 10 remediation, secure code fixes, or scan findings.
                  </p>

                  <div className={styles.suggestionsGrid}>
                    {STARTER_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className={styles.suggestionChip}
                      >
                        <span>⚡</span>
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${
                      msg.role === 'user' ? styles.userRow : styles.modelRow
                    }`}
                  >
                    <div
                      className={`${styles.bubble} ${
                        msg.role === 'user' ? styles.userBubble : styles.modelBubble
                      }`}
                    >
                      {renderFormattedContent(msg.content, msg.id)}

                      <div className={styles.bubbleMeta}>
                        <span>{msg.timestamp}</span>
                        {msg.latency_ms && (
                          <span className="text-cyan-400">⚡ {msg.latency_ms} ms</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Thinking / Streaming Indicator */}
              {isSending && (
                <div className={`${styles.messageRow} ${styles.modelRow}`}>
                  <div className={styles.thinkingBubble}>
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className="ml-1 tracking-normal font-medium text-xs text-slate-300">
                      Analyzing with Gemini...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className={styles.inputArea}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className={styles.inputForm}
              >
                <div className={styles.inputWrapper}>
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about vulnerabilities, remediation code, or scan findings..."
                    className={styles.textarea}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    className={styles.sendBtn}
                    title="Send Message"
                  >
                    ➤
                  </button>
                </div>

                <div className={styles.inputHint}>
                  <span>Press <kbd className="font-mono text-[10px] text-slate-400">Enter ↵</kbd> to send, <kbd className="font-mono text-[10px] text-slate-400">Shift+Enter</kbd> for newline</span>
                  <span className="text-[10px] text-slate-500 font-mono">EthioVuln AI v1.0</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatDrawer;
