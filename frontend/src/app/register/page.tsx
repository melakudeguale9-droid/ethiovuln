// EthioVuln — Register Page

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '', fullName: '' });
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
      { label: 'Very Weak', color: '#ff0040' },
      { label: 'Weak', color: '#ff4444' },
      { label: 'Fair', color: '#ffb020' },
      { label: 'Good', color: '#44bb44' },
      { label: 'Strong', color: '#00ff88' },
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
      setError('Password must be at least 8 characters');
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
    setForm(prev => ({ ...prev, [field]: value }));
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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #00ff88, #0088ff)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#0a0e1a', marginBottom: 16,
          }}>E</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            <span className="text-gradient">Create Account</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Join EthioVuln</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,0,64,0.1)', border: '1px solid rgba(255,0,64,0.3)',
            borderRadius: 12, padding: '10px 16px', marginBottom: 20, color: '#ff4444', fontSize: 14,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>Full Name</label>
            <input id="register-fullname" className="input-field" placeholder="John Doe"
              value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>Email</label>
            <input id="register-email" type="email" className="input-field" placeholder="you@example.com"
              value={form.email} onChange={e => updateForm('email', e.target.value)} required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>Username</label>
            <input id="register-username" className="input-field" placeholder="johndoe"
              value={form.username} onChange={e => updateForm('username', e.target.value)} required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>Password</label>
            <input id="register-password" type="password" className="input-field" placeholder="••••••••"
              value={form.password} onChange={e => updateForm('password', e.target.value)} required />
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= passwordStrength.score ? passwordStrength.color : 'rgba(148,163,184,0.2)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: passwordStrength.color }}>{passwordStrength.label}</span>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#94a3b8' }}>Confirm Password</label>
            <input id="register-confirm" type="password" className="input-field" placeholder="••••••••"
              value={form.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} required />
          </div>

          <button id="register-submit" type="submit" className="btn-glow btn-glow-green"
            disabled={loading} style={{ width: '100%', fontSize: 15 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
