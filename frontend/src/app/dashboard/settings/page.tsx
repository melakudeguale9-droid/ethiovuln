// EthioVuln — Settings Page (Change Password)

'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          ⚙️ Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Manage your account security</p>
      </div>

      {/* Change Password Card */}
      <div className="glass-card" style={{ maxWidth: 480, padding: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
          🔑 Change Password
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
          Use a strong password with uppercase, lowercase, numbers, and symbols.
        </p>

        {/* Success message */}
        {success && (
          <div style={{
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.3)',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 20,
            color: '#00ff88',
            fontSize: 14,
          }}>
            ✓ {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(255,0,64,0.08)',
            border: '1px solid rgba(255,0,64,0.3)',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 20,
            color: '#ff4444',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
              Current Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
              New Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
              Confirm New Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-glow btn-glow-green"
            disabled={loading}
            style={{ width: '100%', fontSize: 14 }}
          >
            {loading ? 'Changing...' : '🔐 Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
