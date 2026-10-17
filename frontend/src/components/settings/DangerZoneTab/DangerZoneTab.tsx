import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { api } from '@/lib/api';
import { settingsApi } from '@/lib/settingsApi';
import styles from './DangerZoneTab.module.css';

export function DangerZoneTab() {
  const [dangerMsg, setDangerMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleteAccountPw, setDeleteAccountPw] = useState('');
  const [confirmDeleteHistory, setConfirmDeleteHistory] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const exportData = async () => {
    try {
      const data = await settingsApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ethiovuln-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setDangerMsg({ type: 'error', msg: err.message || 'Export failed' });
    }
  };

  const deleteHistory = async () => {
    try {
      await settingsApi.deleteScanHistory();
      setDangerMsg({ type: 'success', msg: 'All scan history deleted' });
      setConfirmDeleteHistory(false);
    } catch (err: any) {
      setDangerMsg({ type: 'error', msg: err.message || 'Failed to delete history' });
    }
  };

  const deleteAccount = async () => {
    try {
      await settingsApi.deleteAccount(deleteAccountPw);
      api.logout();
    } catch (err: any) {
      setDangerMsg({ type: 'error', msg: err.message || 'Failed to delete account' });
    }
  };

  return (
    <Card danger>
      <SectionHeader
        icon="⚠️"
        title="Danger Zone"
        subtitle="Irreversible actions — proceed with caution"
      />
      {dangerMsg && <Alert type={dangerMsg.type} msg={dangerMsg.msg} />}

      {/* Export Data */}
      <div className={styles.section}>
        <p className={styles.title}>📦 Export My Data</p>
        <p className={styles.desc}>Download all your account data and scan history as JSON</p>
        <button onClick={exportData} className={styles.exportBtn}>
          ⬇️ Download Export
        </button>
      </div>

      {/* Sign Out */}
      <div className={styles.section}>
        <p className={styles.title}>🚪 Sign Out</p>
        <p className={styles.desc}>End your current session</p>
        <button onClick={() => api.logout()} className={styles.signOutBtn}>
          🚪 Sign Out
        </button>
      </div>

      {/* Delete History */}
      <div className={styles.section}>
        <p className={styles.dangerTitle}>🗑️ Delete All Scan History</p>
        <p className={styles.desc}>
          Permanently delete all scans and vulnerability findings. This cannot be undone.
        </p>
        {!confirmDeleteHistory ? (
          <button
            onClick={() => setConfirmDeleteHistory(true)}
            className={styles.dangerOutlineBtn}
          >
            🗑️ Delete All Scans
          </button>
        ) : (
          <div className={styles.confirmRow}>
            <span style={{ fontSize: 12, color: '#ff4444' }}>Are you sure?</span>
            <button onClick={deleteHistory} className={styles.dangerSolidBtn}>
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDeleteHistory(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Delete Account */}
      <div className={styles.lastSection}>
        <p className={styles.dangerTitle}>💀 Delete Account</p>
        <p className={styles.desc}>
          Permanently delete your account and all associated data. This action cannot be reversed.
        </p>
        {!confirmDeleteAccount ? (
          <button
            onClick={() => setConfirmDeleteAccount(true)}
            className={styles.dangerOutlineBtn}
          >
            💀 Delete My Account
          </button>
        ) : (
          <div>
            <input
              type="password"
              className="input-field"
              value={deleteAccountPw}
              onChange={(e) => setDeleteAccountPw(e.target.value)}
              placeholder="Enter your password to confirm"
              style={{ marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={deleteAccount}
                className={styles.dangerSolidBtn}
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                Permanently Delete
              </button>
              <button
                onClick={() => {
                  setConfirmDeleteAccount(false);
                  setDeleteAccountPw('');
                }}
                className={styles.cancelBtn}
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
