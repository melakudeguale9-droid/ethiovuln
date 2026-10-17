import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Toggle } from '@/components/settings/Toggle';
import { settingsApi } from '@/lib/settingsApi';
import styles from './NotificationsTab.module.css';

export interface NotificationsTabProps {
  initialPrefs: Record<string, any>;
}

export function NotificationsTab({ initialPrefs }: NotificationsTabProps) {
  const [prefs, setPrefs] = useState<Record<string, any>>(initialPrefs);
  const [prefsMsg, setPrefsMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const savePrefs = async () => {
    setPrefsLoading(true);
    setPrefsMsg(null);
    try {
      await settingsApi.updatePreferences(prefs);
      setPrefsMsg({ type: 'success', msg: 'Notification preferences saved' });
    } catch (err: any) {
      setPrefsMsg({ type: 'error', msg: err.message || 'Failed to save preferences' });
    } finally {
      setPrefsLoading(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon="🔔"
        title="Notifications"
        subtitle="Control how and when you receive alerts"
      />
      {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}

      <Toggle
        checked={prefs.notify_scan_complete !== false}
        onChange={(v) => setPrefs((p) => ({ ...p, notify_scan_complete: v }))}
        label="Browser notification when scan completes"
      />
      <Toggle
        checked={prefs.notify_critical_finding !== false}
        onChange={(v) => setPrefs((p) => ({ ...p, notify_critical_finding: v }))}
        label="Alert when critical vulnerability found"
      />
      <Toggle
        checked={prefs.notify_email || false}
        onChange={(v) => setPrefs((p) => ({ ...p, notify_email: v }))}
        label="Email notification on scan completion"
      />

      <button
        onClick={savePrefs}
        className={`btn-glow btn-glow-green ${styles.submitBtn}`}
        disabled={prefsLoading}
      >
        {prefsLoading ? 'Saving...' : '💾 Save Notification Preferences'}
      </button>
    </Card>
  );
}
