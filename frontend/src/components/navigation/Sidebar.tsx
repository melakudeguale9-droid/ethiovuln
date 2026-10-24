'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { DASHBOARD_NAV_ITEMS } from '@/lib/constants';
import type { User } from '@/types/user';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  user: User;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function Sidebar({ user, collapsed, onToggleCollapse, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;

  // Settings section state
  const isSettingsActive =
    pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/wordlists');
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  // Auto-expand whenever navigating to a settings or wordlists sub-page
  useEffect(() => {
    if (isSettingsActive) {
      setSettingsExpanded(true);
    }
  }, [isSettingsActive]);

  return (
    <div
      className={styles.sidebar}
      style={{
        width: '100%',
      }}
    >
      {/* ─── Brand Header ────────────────────────────────────────── */}
      <div
        className={styles.brandHeader}
        style={{
          padding: collapsed ? '20px 14px' : '20px 20px',
        }}
      >
        <Link href="/" className={styles.brandLink}>
          <div className="w-9 h-9 relative flex items-center justify-center shrink-0 transition-transform hover:scale-105">
            <svg className="w-9 h-9 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L4 9V17C4 25.5 10 32.5 18 34.5C26 32.5 32 25.5 32 17V9L18 3Z" fill="#0B132B" stroke="#1E293B" strokeWidth="2" />
              <path d="M18 4L5 9.5V17C5 24.8 10.6 31.4 18 33.3V4Z" fill="#0284C7" />
              <path d="M18 4L31 9.5V17C31 24.8 25.4 31.4 18 33.3V4Z" fill="#F8FAFC" />
              <path d="M18 9L11 13V17C11 21.5 14 25.5 18 27V9Z" fill="#00F0FF" />
              <circle cx="23" cy="18" r="2" fill="#E11D48" />
            </svg>
          </div>
          {!collapsed && (
            <span className={styles.brandText}>
              Ethio<span className={styles.brandHighlight}>Vuln</span>
            </span>
          )}
        </Link>
      </div>

      {/* ─── Navigation Links ────────────────────────────────────── */}
      <nav className={styles.nav}>
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const children = item.children;
          const hasChildren = Boolean(children && children.length > 0);
          const isChildActive = Boolean(children?.some((child) => pathname === child.href));
          const isActive =
            pathname === item.href ||
            isChildActive ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          // Render dropdown items (Settings)
          if (children && children.length > 0 && !collapsed) {
            const isSettings = item.href === '/dashboard/settings';
            const isExpanded = isSettings ? settingsExpanded : true;

            return (
              <div key={item.href} style={{ marginBottom: 4 }}>
                <div
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => {
                    if (isSettings) {
                      setSettingsExpanded((prev) => !prev);
                    }
                  }}
                  title="Click to expand/collapse Settings options"
                >
                  <span
                    className={styles.navIcon}
                    style={{
                      color: isActive ? '#00E5FF' : '#94A3B8',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className={styles.navLabel}>{item.label}</span>
                  <span className={`${styles.caret} ${isExpanded ? styles.caretOpen : ''}`}>
                    ▼
                  </span>
                </div>

                {/* Sub-items (clean dropdown under Settings) */}
                {isExpanded && (
                  <div className={styles.subNavContainer}>
                    {children.map((child) => {
                      // Precise tab/route matching
                      const isSubActive = (() => {
                        if (child.href.includes('?tab=')) {
                          const tabParam = child.href.split('?tab=')[1];
                          return (
                            pathname === '/dashboard/settings' &&
                            (currentTab ? currentTab === tabParam : tabParam === 'profile')
                          );
                        }
                        return pathname === child.href;
                      })();

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`${styles.subNavLink} ${
                            isSubActive ? styles.subNavLinkActive : ''
                          }`}
                        >
                          {child.icon && (
                            <span className={styles.subIcon}>
                              {child.icon}
                            </span>
                          )}
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Top-level item
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={styles.navIcon}
                style={{
                  color: isActive ? '#00E5FF' : '#94A3B8',
                }}
              >
                {item.icon}
              </span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ─── User Footer & Session Controls ──────────────────────── */}
      <div className={styles.userFooter}>
        {!collapsed && (
          <div style={{ marginBottom: 14 }}>
            <div className={styles.userName}>
              {user.full_name || user.username}
            </div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        )}

        <div style={{ marginBottom: 10, display: 'flex', justifyContent: collapsed ? 'center' : 'stretch' }}>
          <ThemeToggle
            id="sidebar-theme-toggle"
            showLabel={!collapsed}
            className="w-full justify-center"
          />
        </div>

        <div className={styles.controlsRow}>
          <button
            onClick={onToggleCollapse}
            className={styles.toggleBtn}
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
              className={styles.logoutBtn}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
