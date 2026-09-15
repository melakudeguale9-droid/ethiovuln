// EthioVuln — Back / Next Page Navigation Component

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageNavProps {
  backHref?: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  title?: string;
}

export default function PageNav({ backHref, backLabel = 'Back', nextHref, nextLabel = 'Next', title }: PageNavProps) {
  const router = useRouter();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
      padding: '10px 0',
      borderBottom: '1px solid rgba(148,163,184,0.08)',
    }}>
      {/* Back button */}
      <div>
        {backHref ? (
          <Link href={backHref} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#94a3b8', textDecoration: 'none',
            fontSize: 13, fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; }}
          >
            ← {backLabel}
          </Link>
        ) : (
          <button onClick={() => router.back()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#94a3b8', cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
          }}>
            ← {backLabel}
          </button>
        )}
      </div>

      {/* Page title (center) */}
      {title && (
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</span>
      )}

      {/* Next button */}
      <div>
        {nextHref ? (
          <Link href={nextHref} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8,
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.2)',
            color: '#00ff88', textDecoration: 'none',
            fontSize: 13, fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.15)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,255,136,0.08)'; }}
          >
            {nextLabel} →
          </Link>
        ) : (
          <div style={{ width: 80 }} /> // spacer to keep title centered
        )}
      </div>
    </div>
  );
}
