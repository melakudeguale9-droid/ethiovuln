import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';
import { Toggle } from '@/components/settings/Toggle';
import { settingsApi } from '@/lib/settingsApi';
import styles from './DashboardPrefsTab.module.css';

export interface DashboardPrefsTabProps {
  initialPrefs: Record<string, any>;
}

export function DashboardPrefsTab({ initialPrefs }: DashboardPrefsTabProps) {
  const [prefs, setPrefs] = useState<Record<string, any>>(initialPrefs);
  const [prefsMsg, setPrefsMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const savePrefs = async () => {
    setPrefsLoading(true);
    setPrefsMsg(null);
    try {
      await settingsApi.updatePreferences(prefs);
      setPrefsMsg({ type: 'success', msg: 'Dashboard preferences saved' });
    } catch (err: any) {
      setPrefsMsg({ type: 'error', msg: err.message || 'Failed to save preferences' });
    } finally {
      setPrefsLoading(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon="📊"
        title="Dashboard Preferences"
        subtitle="Customize how the dashboard displays data"
      />
      {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}

      <Field label="Default Severity Filter">
        <select
          className="input-field"
          value={prefs.default_severity_filter || 'all'}
          onChange={(e) => setPrefs((p) => ({ ...p, default_severity_filter: e.target.value }))}
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical Only</option>
          <option value="high">High & Above</option>
          <option value="medium">Medium & Above</option>
          <option value="low">Low & Above</option>
        </select>
      </Field>

      <Field label="Items Per Page">
        <select
          className="input-field"
          value={prefs.items_per_page || 20}
          onChange={(e) => setPrefs((p) => ({ ...p, items_per_page: parseInt(e.target.value) }))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </Field>

      <Toggle
        checked={prefs.show_stats_cards !== false}
        onChange={(v) => setPrefs((p) => ({ ...p, show_stats_cards: v }))}
        label="Show statistics cards on dashboard"
      />

      <button
        onClick={savePrefs}
        className={`btn-glow btn-glow-green ${styles.submitBtn}`}
        disabled={prefsLoading}
      >
        {prefsLoading ? 'Saving...' : '💾 Save Dashboard Preferences'}
      </button>
    </Card>
  );
}
