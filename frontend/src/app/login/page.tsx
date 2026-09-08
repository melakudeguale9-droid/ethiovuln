// EthioVuln — Login Page

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 20,
    }}>
      <div className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #00ff88, #0088ff)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: '#0a0e1a',
            marginBottom: 16,
          }}>
            D
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            <span className="text-gradient">EthioVuln</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255,0,64,0.1)',
            border: '1px solid rgba(255,0,64,0.3)',
            borderRadius: 12,
            padding: '10px 16px',
            marginBottom: 20,
            color: '#ff4444',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn-glow btn-glow-green"
            disabled={loading}
            style={{ width: '100%', fontSize: 15 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
