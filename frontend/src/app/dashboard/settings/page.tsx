// EthioVuln — Full Settings Page

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { settingsApi } from '@/lib/settingsApi';
import { api } from '@/lib/api';

// ─── Reusable components ──────────────────────────────────────────────────────

const Card = ({ children, danger = false }: { children: React.ReactNode; danger?: boolean }) => (
  <div style={{
    background: 'rgba(17,24,39,0.8)',
    border: `1px solid ${danger ? 'rgba(255,0,64,0.25)' : 'rgba(148,163,184,0.1)'}`,
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
  }}>{children}</div>
);

const SectionHeader = ({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{icon} {title}</h2>
    <p style={{ fontSize: 12, color: '#64748b' }}>{subtitle}</p>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
    <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s',
        background: checked ? '#00ff88' : 'rgba(148,163,184,0.2)',
        position: 'relative', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', left: checked ? 23 : 3,
      }} />
    </div>
  </div>
);

const Alert = ({ type, msg }: { type: 'success' | 'error'; msg: string }) => (
  <div style={{
    background: type === 'success' ? 'rgba(0,255,136,0.08)' : 'rgba(255,0,64,0.08)',
    border: `1px solid ${type === 'success' ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,64,0.3)'}`,
    borderRadius: 10, padding: '10px 16px', marginBottom: 16,
    color: type === 'success' ? '#00ff88' : '#ff4444', fontSize: 13,
  }}>
    {type === 'success' ? '✓ ' : '✗ '}{msg}
  </div>
);

interface LoginHistoryEntry {
  id: string;
  ip_address: string | null;
  success: boolean;
  created_at: string;
}

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
}

interface Preferences {
  default_scan_type?: string;
  default_scan_timeout?: number;
  default_fuzzer_threads?: number;
  auto_stop_on_critical?: boolean;
  exclude_paths?: string;
  default_severity_filter?: string;
  items_per_page?: number;
  show_stats_cards?: boolean;
  notify_scan_complete?: boolean;
  notify_critical_finding?: boolean;
  notify_email?: boolean;
  report_include_low?: boolean;
  report_company_name?: string;
}

interface ApiKeyResult {
  raw_key: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuth();

  // Active tab
  const [tab, setTab] = useState('profile');

  // Profile
  const [profile, setProfile] = useState({ full_name: '', username: '', email: '' });
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  // Login history
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [apiKeyMsg, setApiKeyMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Preferences
  const [prefs, setPrefs] = useState<Preferences>({});
  const [prefsMsg, setPrefsMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);

  // Session
  const [sessionInfo, setSessionInfo] = useState<{ created: string; expires: string } | null>(null);

  // Danger zone
  const [dangerMsg, setDangerMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleteAccountPw, setDeleteAccountPw] = useState('');
  const [confirmDeleteHistory, setConfirmDeleteHistory] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  // Load data
  useEffect(() => {
    if (user) {
      setProfile({ full_name: user.full_name || '', username: user.username || '', email: user.email || '' });
    }
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setSessionInfo({
          created: new Date(payload.iat * 1000).toLocaleString(),
          expires: new Date(payload.exp * 1000).toLocaleString(),
        });
      } catch { /* ignore */ }
    }
    loadApiKeys();
    loadLoginHistory();
    loadPreferences();
  }, [user]);

  const loadApiKeys = async () => {
    try { setApiKeys((await settingsApi.listApiKeys()) as ApiKey[]); } catch { /* ignore */ }
  };

  const loadLoginHistory = async () => {
    try { setLoginHistory((await settingsApi.getLoginHistory()) as LoginHistoryEntry[]); } catch { /* ignore */ }
  };

  const loadPreferences = async () => {
    try { setPrefs((await settingsApi.getPreferences()) as Preferences); } catch { /* ignore */ }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true); setProfileMsg(null);
    try {
      await settingsApi.updateProfile(profile);
      setProfileMsg({ type: 'success', msg: 'Profile updated successfully' });
    } catch (err: unknown) {
      setProfileMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to update profile') });
    } finally { setProfileLoading(false); }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.new !== pw.confirm) { setPwMsg({ type: 'error', msg: 'Passwords do not match' }); return; }
    if (pw.new.length < 8) { setPwMsg({ type: 'error', msg: 'Password must be at least 8 characters' }); return; }
    setPwLoading(true);
    try {
      await api.changePassword(pw.current, pw.new);
      setPwMsg({ type: 'success', msg: 'Password changed successfully' });
      setPw({ current: '', new: '', confirm: '' });
    } catch (err: unknown) {
      setPwMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to change password') });
    } finally { setPwLoading(false); }
  };

  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiKeyMsg(null); setNewKeyResult(null);
    if (!newKeyName.trim()) return;
    try {
      const result = await settingsApi.createApiKey(newKeyName) as ApiKeyResult;
      setNewKeyResult(result.raw_key);
      setNewKeyName('');
      loadApiKeys();
    } catch (err: unknown) {
      setApiKeyMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to create API key') });
    }
  };

  const revokeApiKey = async (id: string) => {
    try {
      await settingsApi.revokeApiKey(id);
      setApiKeys(prev => prev.filter(k => k.id !== id));
    } catch (err: unknown) {
      setApiKeyMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to revoke key') });
    }
  };

  const savePrefs = async () => {
    setPrefsLoading(true); setPrefsMsg(null);
    try {
      await settingsApi.updatePreferences(prefs);
      setPrefsMsg({ type: 'success', msg: 'Preferences saved' });
    } catch (err: unknown) {
      setPrefsMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to save preferences') });
    } finally { setPrefsLoading(false); }
  };

  const exportData = async () => {
    try {
      const data = await settingsApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'ethiovuln-export.json'; a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setDangerMsg({ type: 'error', msg: getErrorMessage(err, 'Export failed') });
    }
  };

  const deleteHistory = async () => {
    try {
      await settingsApi.deleteScanHistory();
      setDangerMsg({ type: 'success', msg: 'All scan history deleted' });
      setConfirmDeleteHistory(false);
    } catch (err: unknown) {
      setDangerMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to delete history') });
    }
  };

  const deleteAccount = async () => {
    try {
      await settingsApi.deleteAccount(deleteAccountPw);
      api.logout();
    } catch (err: unknown) {
      setDangerMsg({ type: 'error', msg: getErrorMessage(err, 'Failed to delete account') });
    }
  };

  // ── Tabs config ───────────────────────────────────────────────────────────

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'security', label: '🔑 Security' },
    { id: 'scans', label: '🔍 Scan Prefs' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'reports', label: '📄 Reports' },
    { id: 'apikeys', label: '🌐 API Keys' },
    { id: 'danger', label: '⚠️ Danger Zone' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>⚙️ Settings</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Manage your account, preferences, and security</p>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24,
        borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: 12,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
            background: tab === t.id ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.03)',
            color: tab === t.id ? '#00ff88' : '#64748b',
            outline: tab === t.id ? '1px solid rgba(0,255,136,0.3)' : '1px solid transparent',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 600 }}>

        {/* ── PROFILE ─────────────────────────────────────────────── */}
        {tab === 'profile' && (
          <Card>
            <SectionHeader icon="👤" title="Profile Information" subtitle="Update your display name, username, and email address" />
            {profileMsg && <Alert type={profileMsg.type} msg={profileMsg.msg} />}
            <form onSubmit={saveProfile}>
              <Field label="Full Name">
                <input className="input-field" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Your full name" />
              </Field>
              <Field label="Username">
                <input className="input-field" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} placeholder="username" />
              </Field>
              <Field label="Email Address">
                <input type="email" className="input-field" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
              </Field>
              <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(148,163,184,0.08)' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Role</div>
                <div style={{ fontSize: 13, color: '#f1f5f9' }}>{user?.is_admin ? '🛡️ Administrator' : '👤 User'}</div>
              </div>
              <button type="submit" className="btn-glow btn-glow-green" disabled={profileLoading} style={{ width: '100%', marginTop: 18, fontSize: 14 }}>
                {profileLoading ? 'Saving...' : '💾 Save Profile'}
              </button>
            </form>
          </Card>
        )}

        {/* ── SECURITY ────────────────────────────────────────────── */}
        {tab === 'security' && (
          <>
            <Card>
              <SectionHeader icon="🔑" title="Change Password" subtitle="Use a strong password with uppercase, lowercase, numbers, and symbols" />
              {pwMsg && <Alert type={pwMsg.type} msg={pwMsg.msg} />}
              <form onSubmit={savePassword}>
                <Field label="Current Password">
                  <input type="password" className="input-field" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} placeholder="Current password" required />
                </Field>
                <Field label="New Password">
                  <input type="password" className="input-field" value={pw.new} onChange={e => setPw(p => ({ ...p, new: e.target.value }))} placeholder="New password (min 8 chars)" required />
                </Field>
                <Field label="Confirm New Password">
                  <input type="password" className="input-field" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Confirm new password" required />
                </Field>
                <button type="submit" className="btn-glow btn-glow-green" disabled={pwLoading} style={{ width: '100%', marginTop: 8, fontSize: 14 }}>
                  {pwLoading ? 'Changing...' : '🔐 Change Password'}
                </button>
              </form>
            </Card>

            <Card>
              <SectionHeader icon="🕐" title="Login History" subtitle="Last 20 login attempts to your account" />
              {loginHistory.length === 0 ? (
                <p style={{ fontSize: 13, color: '#64748b' }}>No login history yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {loginHistory.map(h => (
                    <div key={h.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${h.success ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,64,0.1)'}`,
                    }}>
                      <div>
                        <div style={{ fontSize: 12, color: h.success ? '#00ff88' : '#ff4444', fontWeight: 600 }}>
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

            {sessionInfo && (
              <Card>
                <SectionHeader icon="🔒" title="Current Session" subtitle="Details about your active login session" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[{ label: 'Session Started', value: sessionInfo.created }, { label: 'Session Expires', value: sessionInfo.expires }].map(({ label, value }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(148,163,184,0.08)' }}>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* ── SCAN PREFERENCES ────────────────────────────────────── */}
        {tab === 'scans' && (
          <Card>
            <SectionHeader icon="🔍" title="Scan Preferences" subtitle="Default settings applied when creating new scans" />
            {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}
            <Field label="Default Scan Type">
              <select className="input-field" value={prefs.default_scan_type || 'full'} onChange={e => setPrefs(p => ({ ...p, default_scan_type: e.target.value }))}>
                <option value="full">Full Scan</option>
                <option value="nuclei_only">Nuclei Only</option>
                <option value="zap_only">ZAP Only</option>
                <option value="fuzz_only">Fuzzing Only</option>
                <option value="nuclei_zap">Nuclei + ZAP</option>
              </select>
            </Field>
            <Field label={`Default Scan Timeout — ${prefs.default_scan_timeout || 30} minutes`}>
              <input type="range" min={5} max={120} step={5} value={prefs.default_scan_timeout || 30}
                onChange={e => setPrefs(p => ({ ...p, default_scan_timeout: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#00ff88' }} />
            </Field>
            <Field label={`Default Fuzzer Threads — ${prefs.default_fuzzer_threads || 30}`}>
              <input type="range" min={5} max={100} step={5} value={prefs.default_fuzzer_threads || 30}
                onChange={e => setPrefs(p => ({ ...p, default_fuzzer_threads: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#00ff88' }} />
            </Field>
            <Toggle checked={prefs.auto_stop_on_critical || false} onChange={v => setPrefs(p => ({ ...p, auto_stop_on_critical: v }))} label="Auto-stop scan on critical finding" />
            <Field label="Exclude Paths (comma-separated)">
              <input className="input-field" value={prefs.exclude_paths || ''} onChange={e => setPrefs(p => ({ ...p, exclude_paths: e.target.value }))} placeholder="/admin, /logout, /static" />
            </Field>
            <button onClick={savePrefs} className="btn-glow btn-glow-green" disabled={prefsLoading} style={{ width: '100%', marginTop: 16, fontSize: 14 }}>
              {prefsLoading ? 'Saving...' : '💾 Save Scan Preferences'}
            </button>
          </Card>
        )}

        {/* ── DASHBOARD PREFERENCES ───────────────────────────────── */}
        {tab === 'dashboard' && (
          <Card>
            <SectionHeader icon="📊" title="Dashboard Preferences" subtitle="Customize how the dashboard displays data" />
            {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}
            <Field label="Default Severity Filter">
              <select className="input-field" value={prefs.default_severity_filter || 'all'} onChange={e => setPrefs(p => ({ ...p, default_severity_filter: e.target.value }))}>
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High & Above</option>
                <option value="medium">Medium & Above</option>
                <option value="low">Low & Above</option>
              </select>
            </Field>
            <Field label="Items Per Page">
              <select className="input-field" value={prefs.items_per_page || 20} onChange={e => setPrefs(p => ({ ...p, items_per_page: parseInt(e.target.value) }))}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </Field>
            <Toggle checked={prefs.show_stats_cards !== false} onChange={v => setPrefs(p => ({ ...p, show_stats_cards: v }))} label="Show statistics cards on dashboard" />
            <button onClick={savePrefs} className="btn-glow btn-glow-green" disabled={prefsLoading} style={{ width: '100%', marginTop: 16, fontSize: 14 }}>
              {prefsLoading ? 'Saving...' : '💾 Save Dashboard Preferences'}
            </button>
          </Card>
        )}

        {/* ── NOTIFICATIONS ───────────────────────────────────────── */}
        {tab === 'notifications' && (
          <Card>
            <SectionHeader icon="🔔" title="Notifications" subtitle="Control how and when you receive alerts" />
            {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}
            <Toggle checked={prefs.notify_scan_complete !== false} onChange={v => setPrefs(p => ({ ...p, notify_scan_complete: v }))} label="Browser notification when scan completes" />
            <Toggle checked={prefs.notify_critical_finding !== false} onChange={v => setPrefs(p => ({ ...p, notify_critical_finding: v }))} label="Alert when critical vulnerability found" />
            <Toggle checked={prefs.notify_email || false} onChange={v => setPrefs(p => ({ ...p, notify_email: v }))} label="Email notification on scan completion" />
            <button onClick={savePrefs} className="btn-glow btn-glow-green" disabled={prefsLoading} style={{ width: '100%', marginTop: 16, fontSize: 14 }}>
              {prefsLoading ? 'Saving...' : '💾 Save Notification Preferences'}
            </button>
          </Card>
        )}

        {/* ── REPORTS ─────────────────────────────────────────────── */}
        {tab === 'reports' && (
          <Card>
            <SectionHeader icon="📄" title="Report Settings" subtitle="Customize how vulnerability reports are generated" />
            {prefsMsg && <Alert type={prefsMsg.type} msg={prefsMsg.msg} />}
            <Toggle checked={prefs.report_include_low !== false} onChange={v => setPrefs(p => ({ ...p, report_include_low: v }))} label="Include low severity findings in reports" />
            <Field label="Company / Organization Name">
              <input className="input-field" value={prefs.report_company_name || ''} onChange={e => setPrefs(p => ({ ...p, report_company_name: e.target.value }))} placeholder="Your company name (appears in PDF header)" />
            </Field>
            <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(148,163,184,0.08)' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Report Format</div>
              <div style={{ fontSize: 13, color: '#f1f5f9' }}>PDF (WeasyPrint)</div>
            </div>
            <button onClick={savePrefs} className="btn-glow btn-glow-green" disabled={prefsLoading} style={{ width: '100%', marginTop: 16, fontSize: 14 }}>
              {prefsLoading ? 'Saving...' : '💾 Save Report Settings'}
            </button>
          </Card>
        )}

        {/* ── API KEYS ─────────────────────────────────────────────── */}
        {tab === 'apikeys' && (
          <>
            <Card>
              <SectionHeader icon="🌐" title="API Keys" subtitle="Generate keys for programmatic access to the EthioVuln API" />
              {apiKeyMsg && <Alert type={apiKeyMsg.type} msg={apiKeyMsg.msg} />}

              {newKeyResult && (
                <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#00ff88', fontWeight: 600, marginBottom: 8 }}>⚠️ Copy this key now — it will not be shown again</p>
                  <code style={{ fontSize: 12, color: '#f1f5f9', wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 6, display: 'block' }}>{newKeyResult}</code>
                  <button onClick={() => { navigator.clipboard.writeText(newKeyResult); }} style={{ marginTop: 10, padding: '6px 14px', background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 6, color: '#00ff88', fontSize: 12, cursor: 'pointer' }}>
                    📋 Copy to Clipboard
                  </button>
                </div>
              )}

              <form onSubmit={createApiKey} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input className="input-field" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Key name (e.g. CI Pipeline)" style={{ flex: 1 }} required />
                <button type="submit" className="btn-glow btn-glow-green" style={{ padding: '0 20px', fontSize: 13, whiteSpace: 'nowrap' }}>+ Generate</button>
              </form>

              {apiKeys.length === 0 ? (
                <p style={{ fontSize: 13, color: '#64748b' }}>No API keys yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {apiKeys.map(k => (
                    <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)' }}>
                      <div>
                        <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{k.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{k.key_prefix}•••• · Created {new Date(k.created_at).toLocaleDateString()}</div>
                      </div>
                      <button onClick={() => revokeApiKey(k.id)} style={{ padding: '5px 12px', background: 'rgba(255,0,64,0.08)', border: '1px solid rgba(255,0,64,0.2)', borderRadius: 6, color: '#ff4444', fontSize: 11, cursor: 'pointer' }}>Revoke</button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <SectionHeader icon="ℹ️" title="Platform Info" subtitle="EthioVuln system details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Platform', value: 'EthioVuln' },
                  { label: 'Version', value: 'v1.1.0' },
                  { label: 'Scan Engines', value: 'Nuclei, ZAP, Fuzzer' },
                  { label: 'API Docs', value: 'localhost:8000/api/docs' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(148,163,184,0.08)' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ── DANGER ZONE ──────────────────────────────────────────── */}
        {tab === 'danger' && (
          <Card danger>
            <SectionHeader icon="⚠️" title="Danger Zone" subtitle="Irreversible actions — proceed with caution" />
            {dangerMsg && <Alert type={dangerMsg.type} msg={dangerMsg.msg} />}

            {/* Export */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,0,64,0.1)' }}>
              <p style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>📦 Export My Data</p>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Download all your account data and scan history as JSON</p>
              <button onClick={exportData} style={{ padding: '8px 18px', background: 'rgba(0,136,255,0.1)', border: '1px solid rgba(0,136,255,0.3)', borderRadius: 8, color: '#0088ff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                ⬇️ Download Export
              </button>
            </div>

            {/* Sign Out */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,0,64,0.1)' }}>
              <p style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>🚪 Sign Out</p>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>End your current session</p>
              <button onClick={() => api.logout()} style={{ padding: '8px 18px', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                🚪 Sign Out
              </button>
            </div>

            {/* Delete History */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,0,64,0.1)' }}>
              <p style={{ fontSize: 13, color: '#ff4444', fontWeight: 600, marginBottom: 4 }}>🗑️ Delete All Scan History</p>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Permanently delete all scans and vulnerability findings. This cannot be undone.</p>
              {!confirmDeleteHistory ? (
                <button onClick={() => setConfirmDeleteHistory(true)} style={{ padding: '8px 18px', background: 'rgba(255,0,64,0.08)', border: '1px solid rgba(255,0,64,0.3)', borderRadius: 8, color: '#ff4444', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  🗑️ Delete All Scans
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#ff4444' }}>Are you sure?</span>
                  <button onClick={deleteHistory} style={{ padding: '6px 14px', background: '#ff0040', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Yes, Delete</button>
                  <button onClick={() => setConfirmDeleteHistory(false)} style={{ padding: '6px 14px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 6, color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                </div>
              )}
            </div>

            {/* Delete Account */}
            <div style={{ paddingTop: 16 }}>
              <p style={{ fontSize: 13, color: '#ff4444', fontWeight: 600, marginBottom: 4 }}>💀 Delete Account</p>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Permanently delete your account and all associated data. This action cannot be reversed.</p>
              {!confirmDeleteAccount ? (
                <button onClick={() => setConfirmDeleteAccount(true)} style={{ padding: '8px 18px', background: 'rgba(255,0,64,0.08)', border: '1px solid rgba(255,0,64,0.3)', borderRadius: 8, color: '#ff4444', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  💀 Delete My Account
                </button>
              ) : (
                <div>
                  <input type="password" className="input-field" value={deleteAccountPw} onChange={e => setDeleteAccountPw(e.target.value)} placeholder="Enter your password to confirm" style={{ marginBottom: 10 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={deleteAccount} style={{ padding: '8px 18px', background: '#ff0040', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>Permanently Delete</button>
                    <button onClick={() => { setConfirmDeleteAccount(false); setDeleteAccountPw(''); }} style={{ padding: '8px 18px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
