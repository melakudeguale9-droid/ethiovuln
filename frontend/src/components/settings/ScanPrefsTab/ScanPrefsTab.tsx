import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';
import { Toggle } from '@/components/settings/Toggle';
import { settingsApi } from '@/lib/settingsApi';
import styles from './ScanPrefsTab.module.css';

export interface ScanPrefsTabProps {
  initialPrefs: Record<string, any>;
}

export function ScanPrefsTab({ initialPrefs }: ScanPrefsTabProps) {
  const [prefs, setPrefs] = useState<Record<string, any>>(initialPrefs);
  const [prefsMsg, setPrefsMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const savePrefs = async () => {
    setPrefsLoading(true);
    setPrefsMsg(null);
    try {
      await settingsApi.updatePreferences(prefs);
      setPrefsMsg({ type: 'success', msg: 'Scan preferences saved' });
    } catch (err: any) {
      setPrefsMsg({ type: 'error', msg: err.message || 'Failed to save preferences' });
    } finally {
      setPrefsLoading(false);
    }
  };

  return (
    <Card>
      <SectionHeader
        icon="🔍"
        title="Scan Preferences"
        subtitle="Default settings applied when creating new scans"
      />
      {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}

      <Field label="Default Scan Type">
        <select
          className="input-field"
          value={prefs.default_scan_type || 'full'}
          onChange={(e) => setPrefs((p) => ({ ...p, default_scan_type: e.target.value }))}
        >
          <option value="full">Full Scan</option>
          <option value="nuclei_only">Nuclei Only</option>
          <option value="zap_only">ZAP Only</option>
          <option value="fuzz_only">Fuzzing Only</option>
          <option value="nuclei_zap">Nuclei + ZAP</option>
        </select>
      </Field>

      <Field label={`Default Scan Timeout — ${prefs.default_scan_timeout || 30} minutes`}>
        <input
          type="range"
          min={5}
          max={120}
          step={5}
          value={prefs.default_scan_timeout || 30}
          onChange={(e) =>
            setPrefs((p) => ({ ...p, default_scan_timeout: parseInt(e.target.value) }))
          }
          className={styles.rangeInput}
        />
      </Field>

      <Field label={`Default Fuzzer Threads — ${prefs.default_fuzzer_threads || 30}`}>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={prefs.default_fuzzer_threads || 30}
          onChange={(e) =>
            setPrefs((p) => ({ ...p, default_fuzzer_threads: parseInt(e.target.value) }))
          }
          className={styles.rangeInput}
        />
      </Field>

      <Toggle
        checked={prefs.auto_stop_on_critical || false}
        onChange={(v) => setPrefs((p) => ({ ...p, auto_stop_on_critical: v }))}
        label="Auto-stop scan on critical finding"
      />

      <Field label="Exclude Paths (comma-separated)">
        <input
          className="input-field"
          value={prefs.exclude_paths || ''}
          onChange={(e) => setPrefs((p) => ({ ...p, exclude_paths: e.target.value }))}
          placeholder="/admin, /logout, /static"
        />
      </Field>

      <button
        onClick={savePrefs}
        className={`btn-glow btn-glow-green ${styles.submitBtn}`}
        disabled={prefsLoading}
      >
        {prefsLoading ? 'Saving...' : '💾 Save Scan Preferences'}
      </button>
    </Card>
  );
}
