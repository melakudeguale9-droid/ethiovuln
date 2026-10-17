// EthioVuln — Reusable Dashboard Sidebar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV_ITEMS } from '@/lib/constants';
import type { User } from '@/types/user';
import styles from './Sidebar.module.css';

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
      className={styles.sidebar}
      style={{
        width: collapsed ? 68 : 240,
      }}
    >
      {/* Brand Header */}
      <div
        className={styles.brandHeader}
        style={{
          padding: collapsed ? '20px 16px' : '20px 20px',
        }}
      >
        <Link href="/" className={styles.brandLink}>
          <div className={styles.logoIcon}>E</div>
          {!collapsed && (
            <span className={styles.brandText}>
              Ethio<span className={styles.brandHighlight}>Vuln</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className={styles.nav}>
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <span
                style={{
                  fontSize: 16,
                  width: 20,
                  textAlign: 'center',
                  color: isActive ? '#00E5FF' : '#64748B',
                }}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Controls */}
      <div className={styles.userFooter}>
        {!collapsed && (
          <div style={{ marginBottom: 16 }}>
            <div className={styles.userName}>
              {user.full_name || user.username}
            </div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        )}
        <div className={styles.controlsRow}>
          <button
            onClick={onToggleCollapse}
            className={`btn-outline ${styles.toggleBtn}`}
            style={{
              flex: collapsed ? 1 : 'none',
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
          {!collapsed && (
            <button
              onClick={onLogout}
              className={`btn-outline ${styles.logoutBtn}`}
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
