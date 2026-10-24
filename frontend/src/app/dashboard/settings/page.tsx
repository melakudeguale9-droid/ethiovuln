'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { settingsApi } from '@/lib/settingsApi';
import { PageNav } from '@/components/navigation/PageNav';
import {
  ProfileTab,
  BillingTab,
  SecurityTab,
  ScanPrefsTab,
  WorkspacesTab,
  VpnProfilesTab,
  NotificationsTab,
  DashboardPrefsTab,
  ReportsTab,
  ApiKeysTab,
  DangerZoneTab,
} from '@/components/settings';
import { WordlistsManager } from '@/components/dashboard/wordlists';

const TAB_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  profile: {
    icon: '👤',
    title: 'Profile Information',
    subtitle: 'Manage your personal details, display name, and account email address.',
  },
  billing: {
    icon: '💳',
    title: 'Billing & Subscription Plans',
    subtitle: 'Manage your active subscription, upgrade from the 7-day Free Trial, and select Monthly or Annual billing packages.',
  },
  security: {
    icon: '🔑',
    title: 'Account Security & Authentication',
    subtitle: 'Update your password, manage active browser sessions, and view security logs.',
  },
  scans: {
    icon: '🔍',
    title: 'Scan Automation Preferences',
    subtitle: 'Default engine profiles, concurrency threads, and timeout limits applied when starting new assessments.',
  },
  workspaces: {
    icon: '🏢',
    title: 'Workspaces Management',
    subtitle: 'Isolate target scopes, asset inventories, and assessment logs across team environments.',
  },
  vpn: {
    icon: '🛡️',
    title: 'VPN Profiles & Network Routing',
    subtitle: 'Route automated scanner traffic through secure WireGuard or OpenVPN tunnels into internal networks.',
  },
  notifications: {
    icon: '🔔',
    title: 'Alerts & Notifications',
    subtitle: 'Configure real-time scan alerts, critical vulnerability webhooks, and email notifications.',
  },
  wordlists: {
    icon: '📋',
    title: 'Wordlists Management',
    subtitle: 'Manage and customize payload wordlists for directory fuzzers, subdomain finders, and password auditing.',
  },
  dashboard: {
    icon: '📊',
    title: 'Dashboard Preferences',
    subtitle: 'Customize metric card priorities, default timeline charts, and vulnerability summary views.',
  },
  reports: {
    icon: '📄',
    title: 'Report Preferences & Export Formats',
    subtitle: 'Configure executive summary generation, CVSS rating methodology, and PDF branding templates.',
  },
  apikeys: {
    icon: '🌐',
    title: 'API Keys & Integrations',
    subtitle: 'Generate and revoke API keys for CLI runners, CI/CD pipeline integrations, and external tools.',
  },
  danger: {
    icon: '⚠️',
    title: 'Danger Zone',
    subtitle: 'Irreversible account and workspace operations, data purges, and account deletion.',
  },
};

function SettingsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'profile';
  const [tab, setTab] = useState(currentTab);
  const [prefs, setPrefs] = useState<Record<string, any>>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TAB_META[tabParam]) {
      setTab(tabParam);
    } else {
      setTab('profile');
    }

    if (typeof window !== 'undefined') {
      const sessionNotice = sessionStorage.getItem('trial_expired_toast');
      const isTrialExpiredParam = searchParams.get('trial_expired') === 'true';
      if (sessionNotice) {
        setToastMessage(sessionNotice);
      } else if (isTrialExpiredParam) {
        setToastMessage(
          'Your 7-day free trial has expired. Core security features (including starting scans and generating reports) are locked. Please select a Monthly or Annual package below to continue.'
        );
      }
    }
  }, [searchParams]);

  // Load preferences
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const p = (await settingsApi.getPreferences()) as Record<string, any>;
        setPrefs(p || {});
      } catch {
        /* fallback to defaults */
      }
    };
    loadPrefs();
  }, []);

  const meta = TAB_META[tab] || TAB_META.profile;

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      {/* ─── Navigation Bar ───────────────────────────────────── */}
      <PageNav
        backHref="/dashboard"
        backLabel="Overview"
        nextHref="/dashboard/scans/new"
        nextLabel="New Scan"
      />

      {/* ─── Trial Expiration Alert Toast Banner ─────────────── */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/40 bg-red-950/50 text-red-200 backdrop-blur-md flex items-start justify-between gap-3 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-bold text-red-100 text-sm">7-Day Free Trial Expired</div>
              <p className="text-xs text-red-300 mt-1 leading-relaxed">{toastMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              if (typeof window !== 'undefined') sessionStorage.removeItem('trial_expired_toast');
            }}
            className="text-red-400 hover:text-white text-sm font-bold px-2 py-1 transition-colors"
            title="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Page Header with Spacious Typography ───────────────── */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-normal leading-relaxed mb-2 flex items-center gap-3">
          <span>{meta.icon}</span>
          <span>{meta.title}</span>
        </h1>
        <p className="text-base text-gray-200 tracking-normal leading-relaxed max-w-4xl">
          {meta.subtitle}
        </p>
      </header>

      {/* ─── Responsive Content Area (Sidebar Driven, Clean & Uncluttered) ── */}
      <main
        className="w-full max-w-full overflow-x-hidden min-w-0 transition-all duration-300"
        style={{
          maxWidth: tab === 'wordlists' ? '1600px' : '920px',
        }}
      >
        {tab === 'profile' && <ProfileTab user={user} />}
        {tab === 'billing' && <BillingTab />}
        {tab === 'security' && <SecurityTab />}
        {tab === 'scans' && <ScanPrefsTab initialPrefs={prefs} />}
        {tab === 'workspaces' && <WorkspacesTab />}
        {tab === 'vpn' && <VpnProfilesTab />}
        {tab === 'notifications' && <NotificationsTab initialPrefs={prefs} />}
        {tab === 'wordlists' && <WordlistsManager />}
        {tab === 'dashboard' && <DashboardPrefsTab initialPrefs={prefs} />}
        {tab === 'reports' && <ReportsTab initialPrefs={prefs} />}
        {tab === 'apikeys' && <ApiKeysTab />}
        {tab === 'danger' && <DangerZoneTab />}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-300">
          <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium tracking-normal text-gray-200">Loading settings...</span>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
