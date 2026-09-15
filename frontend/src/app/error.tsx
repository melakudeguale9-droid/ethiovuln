// EthioVuln — Custom Error Page (runtime errors)

'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,0,64,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,64,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(255,0,64,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 560 }}>

        {/* Error icon */}
        <div style={{
          fontSize: 64,
          marginBottom: 16,
          filter: 'drop-shadow(0 0 20px rgba(255,0,64,0.4))',
        }}>⚠️</div>

        {/* Error label */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,0,64,0.1)',
          border: '1px solid rgba(255,0,64,0.3)',
          borderRadius: 6,
          padding: '4px 14px',
          fontSize: 12,
          fontFamily: 'JetBrains Mono, monospace',
          color: '#ff0040',
          letterSpacing: 2,
          marginBottom: 24,
        }}>RUNTIME_ERROR</div>

        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: 12,
        }}>Something Went Wrong</h1>

        <p style={{
          fontSize: 15,
          color: '#94a3b8',
          lineHeight: 1.7,
          marginBottom: 36,
        }}>
          An unexpected error occurred. You can try again or return to the dashboard.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148,163,184,0.1)',
            borderRadius: 6,
            padding: '8px 16px',
            marginBottom: 28,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#64748b',
          }}>
            Error ID: {error.digest}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 24px',
              background: 'linear-gradient(135deg, #00ff88, #0088ff)',
              color: '#0a0e1a',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ↺ Try Again
          </button>

          <a href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 24px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(148,163,184,0.2)',
            color: '#f1f5f9',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}>
            Dashboard →
          </a>
        </div>

        {/* Footer branding */}
        <p style={{
          marginTop: 48,
          fontSize: 12,
          color: '#64748b',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          EthioVuln — Automated Web Vulnerability Assessment
        </p>
      </div>
    </div>
  );
}
