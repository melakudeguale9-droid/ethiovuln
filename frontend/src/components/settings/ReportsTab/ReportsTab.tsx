import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';
import { Toggle } from '@/components/settings/Toggle';
import { settingsApi } from '@/lib/settingsApi';
import styles from './ReportsTab.module.css';

export interface ReportsTabProps {
  initialPrefs: Record<string, any>;
}

export function ReportsTab({ initialPrefs }: ReportsTabProps) {
  const [prefs, setPrefs] = useState<Record<string, any>>(initialPrefs);
  const [prefsMsg, setPrefsMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const savePrefs = async () => {
    setPrefsLoading(true);
    setPrefsMsg(null);
    try {
      await settingsApi.updatePreferences(prefs);
      setPrefsMsg({ type: 'success', msg: 'Report settings saved' });
    } catch (err: any) {
      setPrefsMsg({ type: 'error', msg: err.message || 'Failed to save preferences' });
    } finally {
      setPrefsLoading(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon="📄"
        title="Report Settings"
        subtitle="Customize how vulnerability reports are generated"
      />
      {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}

      <Toggle
        checked={prefs.report_include_low !== false}
        onChange={(v) => setPrefs((p) => ({ ...p, report_include_low: v }))}
        label="Include low severity findings in reports"
      />

      <Field label="Company / Organization Name">
        <input
          className="input-field"
          value={prefs.report_company_name || ''}
          onChange={(e) => setPrefs((p) => ({ ...p, report_company_name: e.target.value }))}
          placeholder="Your company name (appears in PDF header)"
        />
      </Field>

      <div className={styles.formatBox}>
        <div className={styles.formatLabel}>Report Format</div>
        <div className={styles.formatValue}>PDF (ReportLab)</div>
      </div>

      <button
        onClick={savePrefs}
        className={`btn-glow btn-glow-green ${styles.submitBtn}`}
        disabled={prefsLoading}
      >
        {prefsLoading ? 'Saving...' : '💾 Save Report Settings'}
      </button>
    </Card>
  );
}
