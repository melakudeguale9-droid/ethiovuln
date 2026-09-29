// EthioVuln — Reusable Dashboard Sidebar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV_ITEMS } from '@/lib/constants';
import type { User } from '@/types/user';

export interface SidebarProps {
  user: User;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function Sidebar({ user, collapsed, onToggleCollapse, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        background: 'rgba(13, 21, 39, 0.95)',
        borderRight: '1px solid rgba(148, 163, 184, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '20px 16px' : '20px 20px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00E5FF, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: '#070B14',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
            }}
          >
            E
          </div>
          {!collapsed && (
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              Ethio<span style={{ color: '#00E5FF' }}>Vuln</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px 14px' : '10px 14px',
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#00E5FF' : '#94A3B8',
                background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                border: isActive
                  ? '1px solid rgba(0, 229, 255, 0.25)'
                  : '1px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', color: isActive ? '#00E5FF' : '#64748B' }}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Controls */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          background: 'rgba(7, 11, 20, 0.4)',
        }}
      >
        {!collapsed && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.full_name || user.username}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onToggleCollapse}
            className="btn-outline"
            style={{
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flex: collapsed ? 1 : 'none',
              borderRadius: 8,
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
          {!collapsed && (
            <button
              onClick={onLogout}
              className="btn-outline"
              style={{
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: '#EF4444',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.05)',
                borderRadius: 8,
                flex: 1,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
