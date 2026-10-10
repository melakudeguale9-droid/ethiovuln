// EthioVuln — Responsive Dashboard Layout
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/navigation/Sidebar';
import Link from 'next/link';

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
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header (Navbar) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar Area */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={logout}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 transition-all duration-300" style={{ marginLeft: mobileMenuOpen ? 0 : (sidebarCollapsed ? '68px' : '240px') }} >
        {/* We use inline style for desktop margin because Sidebar uses fixed position internally. Let's fix Sidebar later or handle it here via CSS class if Sidebar is fixed */}
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          {children}
        </div>
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
