'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Alert } from '@/components/ui/Alert';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { PasswordToggleIcon } from '@/components/auth/PasswordToggleIcon';
import styles from './LoginForm.module.css';

export function LoginForm() {
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
    <div className={`glass-card ${styles.card}`}>
      <BrandHeader
        titlePrefix="Sign In to"
        subtitle="Enter your security credentials to access the console"
      />

      {isRegistered && (
        <div className={styles.alertWrapper}>
          <Alert type="success">
            Account created successfully! Please sign in with your credentials.
          </Alert>
        </div>
      )}

      {error && (
        <div className={styles.alertWrapper}>
          <Alert type="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="analyst@agency.et"
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
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
          <div className={styles.forgotRow}>
            <Link href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className={`btn-glow btn-glow-cyan ${styles.submitBtn}`}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : 'Sign In →'}
        </button>

        <div className={styles.footerRow}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.registerLink}>
            Create one here
          </Link>
        </div>
      </form>
    </div>
  );
}
