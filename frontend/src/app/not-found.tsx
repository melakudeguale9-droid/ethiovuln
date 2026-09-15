// EthioVuln — Custom 404 Not Found Page

import Link from 'next/link';

export default function NotFound() {
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
        backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
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
        background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 560 }}>

        {/* 404 code */}
        <div style={{
          fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #00ff88, #0088ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 8,
          letterSpacing: '-4px',
        }}>404</div>

        {/* Terminal-style label */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(0,255,136,0.1)',
          border: '1px solid rgba(0,255,136,0.3)',
          borderRadius: 6,
          padding: '4px 14px',
          fontSize: 12,
          fontFamily: 'JetBrains Mono, monospace',
          color: '#00ff88',
          letterSpacing: 2,
          marginBottom: 24,
        }}>TARGET_NOT_FOUND</div>

        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: 12,
        }}>Page Not Found</h1>

        <p style={{
          fontSize: 15,
          color: '#94a3b8',
          lineHeight: 1.7,
          marginBottom: 36,
        }}>
          The page you are looking for does not exist or has been moved.
          Make sure you have the correct URL and the required permissions.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 24px',
            background: 'linear-gradient(135deg, #00ff88, #0088ff)',
            color: '#0a0e1a',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 14,
          }}>
            ← Back to Home
          </Link>

          <Link href="/dashboard" style={{
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
          </Link>
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
