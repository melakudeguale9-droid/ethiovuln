// EthioVuln — Dashboard Layout with Sidebar

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="pulse-dot" style={{ width: 16, height: 16 }} />
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', icon: '◆', label: 'Overview' },
    { href: '/dashboard/scans', icon: '⬡', label: 'Scans' },
    { href: '/dashboard/scans/new', icon: '＋', label: 'New Scan' },
    { href: '/dashboard/reports', icon: '◧', label: 'Reports' },
    { href: '/dashboard/settings', icon: '⚙', label: 'Settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarCollapsed ? 68 : 240,
        background: 'rgba(17, 24, 39, 0.95)',
        borderRight: '1px solid rgba(148,163,184,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        backdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '20px 16px' : '20px 20px',
          borderBottom: '1px solid rgba(148,163,184,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #00ff88, #0088ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#0a0e1a', flexShrink: 0,
          }}>E</div>
          {!sidebarCollapsed && (
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              <span className="text-gradient">EthioVuln</span>
            </span>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '10px 16px' : '10px 16px',
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#00ff88' : '#94a3b8',
                background: isActive ? 'rgba(0,255,136,0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(0,255,136,0.15)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div style={{
          padding: sidebarCollapsed ? '16px 8px' : '16px',
          borderTop: '1px solid rgba(148,163,184,0.1)',
        }}>
          {!sidebarCollapsed && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
                {user.full_name || user.username}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{user.email}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="btn-outline"
              style={{ padding: '6px 10px', fontSize: 12, flex: sidebarCollapsed ? 1 : 'none' }}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
            {!sidebarCollapsed && (
              <button onClick={logout} className="btn-outline"
                style={{ padding: '6px 10px', fontSize: 12, color: '#ff4444', borderColor: 'rgba(255,68,68,0.3)', flex: 1 }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 68 : 240,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        padding: '24px 32px',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
