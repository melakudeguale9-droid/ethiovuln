'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Alert } from '@/components/ui/Alert';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { PasswordToggleIcon } from '@/components/auth/PasswordToggleIcon';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import styles from './RegisterForm.module.css';

export function RegisterForm() {
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
    return { score, ...(levels[Math.min(score, levels.length) - 1] || levels[0]) };
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
    <div className={`glass-card ${styles.card}`}>
      <BrandHeader
        titlePrefix="Join"
        subtitle="Create an authorized operator account for dynamic vulnerability testing"
      />

      {error && (
        <div className={styles.alertWrapper}>
          <Alert type="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="input-field"
            value={form.fullName}
            onChange={(e) => updateForm('fullName', e.target.value)}
            placeholder="Security Analyst"
            autoComplete="name"
          />
        </div>

        <div className={styles.gridTwo}>
          <div>
            <label htmlFor="username" className={styles.label}>
              Username *
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              value={form.username}
              onChange={(e) => updateForm('username', e.target.value)}
              placeholder="operator_1"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              placeholder="analyst@agency.et"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="password" className={styles.label}>
            Password *
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <PasswordToggleIcon show={showPassword} />
            </button>
          </div>
          <PasswordStrengthMeter
            score={passwordStrength.score}
            label={passwordStrength.label}
            color={passwordStrength.color}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password *
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              className="input-field"
              value={form.confirmPassword}
              onChange={(e) => updateForm('confirmPassword', e.target.value)}
              placeholder="Repeat password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              <PasswordToggleIcon show={showConfirm} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`btn-glow btn-glow-cyan ${styles.submitBtn}`}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account →'}
        </button>

        <div className={styles.footerRow}>
          Already registered?{' '}
          <Link href="/login" className={styles.loginLink}>
            Sign in to console
          </Link>
        </div>
      </form>
    </div>
  );
}
