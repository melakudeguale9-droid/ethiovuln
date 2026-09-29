// EthioVuln — Login Page
'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 440, border: '1px solid rgba(148, 163, 184, 0.15)' }}>
      {/* Brand Header */}
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
          Sign In to <span className="text-gradient">EthioVuln</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 13 }}>Enter your security credentials to access the console</p>
      </div>

      {/* Registration Success Banner */}
      {isRegistered && (
        <div style={{ marginBottom: 20 }}>
          <Alert type="success">
            Account created successfully! Please sign in with your credentials.
          </Alert>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{ marginBottom: 20 }}>
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label
            htmlFor="login-email"
            style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94A3B8' }}
          >
            Work Email
          </label>
          <input
            id="login-email"
            type="email"
            className="input-field"
            placeholder="analyst@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label
              htmlFor="login-password"
              style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}
            >
              Password
            </label>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
                justifyContent: 'center',
                padding: 4,
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn-glow btn-glow-cyan"
          disabled={loading}
          style={{ width: '100%', fontSize: 14, fontWeight: 700, padding: '12px' }}
        >
          {loading ? 'Authenticating...' : 'Sign In to Console →'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <p style={{ color: '#64748B', fontSize: 13 }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Suspense fallback={<div className="pulse-dot" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
