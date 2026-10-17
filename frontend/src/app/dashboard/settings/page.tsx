'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { settingsApi } from '@/lib/settingsApi';
import { PageNav } from '@/components/navigation/PageNav';
import {
  SettingsTabs,
  ProfileTab,
  SecurityTab,
  ScanPrefsTab,
  DashboardPrefsTab,
  NotificationsTab,
  ReportsTab,
  ApiKeysTab,
  DangerZoneTab,
  type TabItem,
} from '@/components/settings';

const SETTINGS_TABS: TabItem[] = [
  { id: 'profile', label: '👤 Profile' },
  { id: 'security', label: '🔑 Security' },
  { id: 'scans', label: '🔍 Scan Prefs' },
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'notifications', label: '🔔 Notifications' },
  { id: 'reports', label: '📄 Reports' },
  { id: 'apikeys', label: '🌐 API Keys' },
  { id: 'danger', label: '⚠️ Danger Zone' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [prefs, setPrefs] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const p = (await settingsApi.getPreferences()) as Record<string, any>;
        setPrefs(p || {});
      } catch {
        /* ignore */
      }
    };
    loadPrefs();
  }, []);

  return (
    <div>
      <PageNav backHref="/dashboard" backLabel="Overview" title="Settings" />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          ⚙️ Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Manage your account, preferences, and security
        </p>
      </div>

      {/* Tab Navigation Bar */}
      <SettingsTabs
        tabs={SETTINGS_TABS}
        activeTab={tab}
        onSelectTab={setTab}
      />

      <div style={{ maxWidth: 600 }}>
        {tab === 'profile' && <ProfileTab user={user} />}
        {tab === 'security' && <SecurityTab />}
        {tab === 'scans' && <ScanPrefsTab initialPrefs={prefs} />}
        {tab === 'dashboard' && <DashboardPrefsTab initialPrefs={prefs} />}
        {tab === 'notifications' && <NotificationsTab initialPrefs={prefs} />}
        {tab === 'reports' && <ReportsTab initialPrefs={prefs} />}
        {tab === 'apikeys' && <ApiKeysTab />}
        {tab === 'danger' && <DangerZoneTab />}
      </div>
    </div>
  );
}
