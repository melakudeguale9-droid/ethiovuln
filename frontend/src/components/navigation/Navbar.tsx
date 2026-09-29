// EthioVuln — Public Navigation Bar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PUBLIC_NAV_ITEMS } from '@/lib/constants';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #00E5FF, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#070B14',
            fontSize: 16,
            boxShadow: '0 0 16px rgba(0, 229, 255, 0.3)',
          }}
        >
          E
        </div>
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
          Ethio<span style={{ color: '#00E5FF' }}>Vuln</span>
        </span>
      </Link>

      <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {PUBLIC_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: isActive ? '#00E5FF' : '#94A3B8',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.color = '#00E5FF';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.color = '#94A3B8';
              }}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/login"
          className="btn-glow btn-glow-cyan"
          style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
