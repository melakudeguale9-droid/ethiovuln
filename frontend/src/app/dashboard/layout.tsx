// EthioVuln — Responsive Dashboard Layout
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlobalAiDock } from '@/components/ai';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-4 h-4 rounded-full bg-cyan-500 animate-ping" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans flex flex-col antialiased w-full max-w-full overflow-x-hidden min-w-0 relative">
      {/* Mobile Top Header (Navbar) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#090D16] border-b border-slate-800 sticky top-0 z-50 w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 shadow-md">
            E
          </div>
          <span className="font-bold text-white tracking-wide">EthioVuln</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/75 z-30 md:hidden"
        />
      )}

      {/* Sidebar Area — Stationary Fixed Desktop Sidebar & Slide-in Mobile Drawer */}
      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-40 h-screen h-[100dvh] transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen
          ? "translate-x-0 visible pointer-events-auto block"
          : "-translate-x-full invisible md:visible pointer-events-none md:pointer-events-auto max-md:hidden"
          }`}
        style={{
          width: sidebarCollapsed ? '68px' : '240px',
        }}
        aria-label="Dashboard Navigation Sidebar"
      >
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={logout}
        />
      </aside>

      {/* Main Content Area — Offset on desktop by the stationary fixed sidebar */}
      <main
        className={`w-full max-w-full min-w-0 overflow-x-hidden transition-all duration-300 pb-24 ${sidebarCollapsed ? 'md:pl-[68px]' : 'md:pl-[240px]'
          }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* ─── Global Fixed Persistent Floating AI Dock, Probe Card & Chat Assistant ─── */}
      <GlobalAiDock />
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
