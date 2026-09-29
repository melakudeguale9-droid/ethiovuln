// EthioVuln — Register Page
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Alert } from '@/components/ui/Alert';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { label: 'Very Weak', color: '#EF4444' },
      { label: 'Weak', color: '#F59E0B' },
      { label: 'Moderate', color: '#3B82F6' },
      { label: 'Strong', color: '#10B981' },
      { label: 'Very Strong', color: '#00E5FF' },
    ];
    return { score, ...levels[Math.min(score, levels.length) - 1] || levels[0] };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.register(form.email, form.username, form.password, form.fullName || undefined);
      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '32px 20px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 460, border: '1px solid rgba(148, 163, 184, 0.15)' }}>
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #00E5FF, #6366F1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 800,
                color: '#070B14',
                marginBottom: 16,
                boxShadow: '0 0 24px rgba(0, 229, 255, 0.3)',
              }}
            >
              E
            </div>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Create Your Account
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 13 }}>Join the EthioVuln Security Platform</p>
        </div>

        {error && (
          <div style={{ marginBottom: 20 }}>
            <Alert type="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94A3B8' }}>
              Full Name
            </label>
            <input
              id="register-fullname"
              className="input-field"
              placeholder="Alex Vance"
              value={form.fullName}
              onChange={(e) => updateForm('fullName', e.target.value)}
              autoComplete="name"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94A3B8' }}>
              Work Email
            </label>
            <input
              id="register-email"
              type="email"
              className="input-field"
              placeholder="alex@organization.com"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94A3B8' }}>
              Username
            </label>
            <input
              id="register-username"
              className="input-field"
              placeholder="avance_sec"
              value={form.username}
              onChange={(e) => updateForm('username', e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94A3B8' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background: i <= passwordStrength.score ? passwordStrength.color : 'rgba(148, 163, 184, 0.15)',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94A3B8' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-confirm"
                type={showConfirm ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••••••"
                value={form.confirmPassword}
                onChange={(e) => updateForm('confirmPassword', e.target.value)}
                required
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn-glow btn-glow-cyan"
            disabled={loading}
            style={{ width: '100%', fontSize: 14, fontWeight: 700, padding: '12px' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <p style={{ color: '#64748B', fontSize: 13 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
