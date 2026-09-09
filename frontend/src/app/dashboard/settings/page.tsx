// EthioVuln — Settings Page

'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

// ─── Reusable section card ────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: 14 }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Alert component ─────────────────────────────────────────────────────────
function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  const isSuccess = type === 'success';
  return (
    <div style={{
      background: isSuccess ? 'rgba(0,255,136,0.08)' : 'rgba(255,0,64,0.08)',
      border: `1px solid ${isSuccess ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,64,0.3)'}`,
      borderRadius: 10, padding: '10px 16px', marginBottom: 16,
      color: isSuccess ? '#00ff88' : '#ff4444', fontSize: 13,
    }}>
      {isSuccess ? '✓' : '✗'} {message}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();

  // ── Profile state ──────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar_url ? `http://localhost:8000${user.avatar_url}` : null
  );
  const [avatarLoading, setAvatarLoading] = useState(false);

  // ── Password state ────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  // ── Scan defaults state ───────────────────────────────────────────────────
  const [defaultScanType, setDefaultScanType] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('default_scan_type') || 'full' : 'full'
  );

  // ── API token state ───────────────────────────────────────────────────────
  const [apiToken, setApiToken] = useState('');
  const [tokenMsg, setTokenMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  // ── Delete account state ──────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    setProfileMsg(null);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      const res = await api.uploadAvatar(file);
      setAvatarPreview(`http://localhost:8000${res.avatar_url}`);
      setProfileMsg({ type: 'success', text: 'Profile photo updated' });
    } catch (err: unknown) {
      setProfileMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await api.updateProfile({ full_name: fullName, username });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: unknown) {
      setProfileMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'Passwords do not match' }); return; }
    if (newPw.length < 8) { setPwMsg({ type: 'error', text: 'Password must be at least 8 characters' }); return; }
    setPwLoading(true);
    try {
      await api.changePassword(currentPw, newPw);
      setPwMsg({ type: 'success', text: 'Password changed successfully' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: unknown) {
      setPwMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleScanDefaultSave = () => {
    localStorage.setItem('default_scan_type', defaultScanType);
    alert('Scan defaults saved');
  };

  const handleGenerateToken = async () => {
    setTokenLoading(true);
    setTokenMsg(null);
    setApiToken('');
    try {
      const res = await api.generateApiToken() as { api_token: string; note: string };
      setApiToken(res.api_token);
      setTokenMsg({ type: 'success', text: 'Token generated. Copy it now — it will not be shown again.' });
    } catch (err: unknown) {
      setTokenMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to generate token' });
    } finally {
      setTokenLoading(false);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(apiToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirm !== 'DELETE') {
      setDeleteMsg({ type: 'error', text: 'Type DELETE to confirm' });
      return;
    }
    setDeleteLoading(true);
    try {
      await api.deleteAccount();
      localStorage.clear();
      window.location.href = '/';
    } catch (err: unknown) {
      setDeleteMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete account' });
      setDeleteLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(148,163,184,0.15)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f1f5f9',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#94a3b8',
    marginBottom: 6,
  };

  const scanTypes = [
    { value: 'full', label: '🔍 Full Scan' },
    { value: 'nuclei', label: '⚡ Nuclei Scan' },
    { value: 'discovery', label: '🗺️ Discovery + Fuzzing' },
    { value: 'zap_spider', label: '🕷️ ZAP Spider' },
    { value: 'zap_nuclei', label: '🛡️ ZAP + Nuclei' },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>⚙️ Settings</h1>
        <p style={{ color: '#64748b', fontSize: 13 }}>Manage your account, security, and preferences</p>
      </div>

      {/* ── 1. Profile ──────────────────────────────────────────────────────── */}
      <Section title="Profile" icon="👤">
        {profileMsg && <Alert type={profileMsg.type} message={profileMsg.text} />}
        {/* Avatar upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: '2px solid rgba(0,255,136,0.3)',
            overflow: 'hidden', flexShrink: 0,
            background: 'rgba(0,255,136,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="30" r="18" fill="rgba(0,255,136,0.2)" stroke="#00ff88" strokeWidth="1.5"/>
                <path d="M10 70c0-16.569 13.431-30 30-30s30 13.431 30 30" fill="rgba(0,255,136,0.1)" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div>
            <label htmlFor="avatar-upload" style={{
              display: 'inline-block', padding: '8px 16px', fontSize: 13,
              background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: 8, color: '#00ff88', cursor: 'pointer', fontWeight: 600,
            }}>
              {avatarLoading ? 'Uploading...' : '📷 Change Photo'}
            </label>
            <input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} style={{ display: 'none' }} />
            <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>JPEG, PNG or WEBP — max 5MB</p>
          </div>
        </div>
        <form onSubmit={handleProfileSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} className="input-field" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <input style={inputStyle} className="input-field" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email Address</label>
            <input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} value={user?.email || ''} disabled />
            <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Email cannot be changed</p>
          </div>
          <button type="submit" className="btn-glow btn-glow-green" disabled={profileLoading} style={{ fontSize: 13, padding: '9px 20px' }}>
            {profileLoading ? 'Saving...' : '💾 Save Profile'}
          </button>
        </form>
      </Section>

      {/* ── 2. Change Password ───────────────────────────────────────────────── */}
      <Section title="Change Password" icon="🔑">
        {pwMsg && <Alert type={pwMsg.type} message={pwMsg.text} />}
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Current Password</label>
            <input type="password" style={inputStyle} className="input-field" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" style={inputStyle} className="input-field" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" required />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" style={inputStyle} className="input-field" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" className="btn-glow btn-glow-green" disabled={pwLoading} style={{ fontSize: 13, padding: '9px 20px' }}>
            {pwLoading ? 'Changing...' : '🔐 Change Password'}
          </button>
        </form>
      </Section>

      {/* ── 3. Scan Defaults ─────────────────────────────────────────────────── */}
      <Section title="Scan Defaults" icon="🔍">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Default Scan Type</label>
          <select
            value={defaultScanType}
            onChange={e => setDefaultScanType(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {scanTypes.map(s => (
              <option key={s.value} value={s.value} style={{ background: '#111827' }}>{s.label}</option>
            ))}
          </select>
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>This will be pre-selected when you create a new scan</p>
        </div>
        <button onClick={handleScanDefaultSave} className="btn-glow btn-glow-green" style={{ fontSize: 13, padding: '9px 20px' }}>
          💾 Save Defaults
        </button>
      </Section>

      {/* ── 4. API Access ────────────────────────────────────────────────────── */}
      <Section title="API Access" icon="🔌">
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16, lineHeight: 1.6 }}>
          Generate a personal API token to access EthioVuln programmatically.
          Use it in the <code style={{ background: 'rgba(0,255,136,0.1)', padding: '2px 6px', borderRadius: 4, color: '#00ff88', fontSize: 12 }}>Authorization: Bearer &lt;token&gt;</code> header.
        </p>
        {tokenMsg && <Alert type={tokenMsg.type} message={tokenMsg.text} />}
        {apiToken && (
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <code style={{ fontSize: 11, color: '#00ff88', fontFamily: 'JetBrains Mono, monospace', flex: 1, wordBreak: 'break-all' }}>
              {apiToken}
            </code>
            <button onClick={handleCopyToken} className="btn-outline" style={{ fontSize: 11, padding: '4px 10px', flexShrink: 0 }}>
              {tokenCopied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}
        <button onClick={handleGenerateToken} className="btn-glow btn-glow-green" disabled={tokenLoading} style={{ fontSize: 13, padding: '9px 20px' }}>
          {tokenLoading ? 'Generating...' : '⚡ Generate API Token'}
        </button>
      </Section>

      {/* ── 5. Danger Zone ───────────────────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: 28, border: '1px solid rgba(255,0,64,0.2)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ff4444', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚠️ Danger Zone
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
          Permanently delete your account and all associated scans, vulnerabilities, and reports. This action cannot be undone.
        </p>
        {deleteMsg && <Alert type={deleteMsg.type} message={deleteMsg.text} />}
        <form onSubmit={handleDeleteAccount}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ ...labelStyle, color: '#ff4444' }}>Type <strong>DELETE</strong> to confirm</label>
            <input
              style={{ ...inputStyle, borderColor: 'rgba(255,0,64,0.3)' }}
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          <button
            type="submit"
            disabled={deleteLoading || deleteConfirm !== 'DELETE'}
            style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 600,
              background: deleteConfirm === 'DELETE' ? 'rgba(255,0,64,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,0,64,0.4)', borderRadius: 8,
              color: deleteConfirm === 'DELETE' ? '#ff4444' : '#64748b',
              cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
            }}
          >
            {deleteLoading ? 'Deleting...' : '🗑️ Delete My Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
