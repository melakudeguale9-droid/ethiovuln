import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Field } from '@/components/settings/Field';
import { api } from '@/lib/api';
import { settingsApi } from '@/lib/settingsApi';
import styles from './SecurityTab.module.css';

export function SecurityTab() {
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{ created: string; expires: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const hist = (await settingsApi.getLoginHistory()) as any[];
        setLoginHistory(hist);
      } catch {
        /* ignore */
      }
    };
    loadData();

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setSessionInfo({
          created: new Date(payload.iat * 1000).toLocaleString(),
          expires: new Date(payload.exp * 1000).toLocaleString(),
        });
      } catch {
        /* ignore */
      }
    }
  }, []);

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.new !== pw.confirm) {
      setPwMsg({ type: 'error', msg: 'Passwords do not match' });
      return;
    }
    if (pw.new.length < 8) {
      setPwMsg({ type: 'error', msg: 'Password must be at least 8 characters' });
      return;
    }
    setPwLoading(true);
    try {
      await api.changePassword(pw.current, pw.new);
      setPwMsg({ type: 'success', msg: 'Password changed successfully' });
      setPw({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setPwMsg({ type: 'error', msg: err.message || 'Failed to change password' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Change Password Card */}
      <Card>
        <SectionHeader
          icon="🔑"
          title="Change Password"
          subtitle="Use a strong password with uppercase, lowercase, numbers, and symbols"
        />
        {pwMsg && <Alert type={pwMsg.type} msg={pwMsg.msg} />}
        <form onSubmit={savePassword}>
          <Field label="Current Password">
            <input
              type="password"
              className="input-field"
              value={pw.current}
              onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
              placeholder="Current password"
              required
            />
          </Field>
          <Field label="New Password">
            <input
              type="password"
              className="input-field"
              value={pw.new}
              onChange={(e) => setPw((p) => ({ ...p, new: e.target.value }))}
              placeholder="New password (min 8 chars)"
              required
            />
          </Field>
          <Field label="Confirm New Password">
            <input
              type="password"
              className="input-field"
              value={pw.confirm}
              onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Confirm new password"
              required
            />
          </Field>
          <button
            type="submit"
            className={`btn-glow btn-glow-green ${styles.submitBtn}`}
            disabled={pwLoading}
          >
            {pwLoading ? 'Changing...' : '🔐 Change Password'}
          </button>
        </form>
      </Card>

      {/* Login History Card */}
      <Card>
        <SectionHeader
          icon="🕐"
          title="Login History"
          subtitle="Last 20 login attempts to your account"
        />
        {loginHistory.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>No login history yet</p>
        ) : (
          <div className={styles.historyList}>
            {loginHistory.map((h) => (
              <div
                key={h.id}
                className={styles.historyItem}
                style={{
                  border: `1px solid ${h.success ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,64,0.1)'}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: h.success ? '#00ff88' : '#ff4444',
                      fontWeight: 600,
                    }}
                  >
                    {h.success ? '✓ Success' : '✗ Failed'}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>IP: {h.ip_address}</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', textAlign: 'right' }}>
                  {new Date(h.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Session Details Card */}
      {sessionInfo && (
        <Card>
          <SectionHeader
            icon="🔒"
            title="Current Session"
            subtitle="Details about your active login session"
          />
          <div className={styles.sessionGrid}>
            {[
              { label: 'Session Started', value: sessionInfo.created },
              { label: 'Session Expires', value: sessionInfo.expires },
            ].map(({ label, value }) => (
              <div key={label} className={styles.sessionItem}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
