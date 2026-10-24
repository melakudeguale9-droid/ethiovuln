'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Alert } from '@/components/ui/Alert';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { PasswordToggleIcon } from '@/components/auth/PasswordToggleIcon';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import styles from './ForgotPasswordForm.module.css';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = (() => {
    const p = newPassword;
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      if (res.reset_token) {
        setToken(res.reset_token);
        setSuccess('Password reset token generated. Proceed below to enter your new password.');
        setStep('reset');
      } else {
        setSuccess(res.message || 'If an account exists for this email, password reset instructions have been sent.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }
    if (!token.trim()) {
      setError('Please provide a valid reset token');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword(token.trim(), newPassword);
      setSuccess(res.message || 'Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. The token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`glass-card ${styles.card}`}>
      <BrandHeader
        titlePrefix="Reset"
        subtitle={
          step === 'request'
            ? 'Enter your registered email to receive account recovery instructions'
            : 'Enter your reset token and choose a secure new password'
        }
      />

      {success && (
        <div className={styles.alertWrapper}>
          <Alert type="success">{success}</Alert>
        </div>
      )}

      {error && (
        <div className={styles.alertWrapper}>
          <Alert type="error">{error}</Alert>
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequestSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Registered Email Address
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

          <button
            type="submit"
            className={`btn-glow btn-glow-cyan ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Recovery Token →'}
          </button>

          <div className={styles.footerRow}>
            <Link href="/login" className={styles.actionLink}>
              ← Back to Sign In
            </Link>
            <button
              type="button"
              className={styles.actionLink}
              onClick={() => {
                setError('');
                setStep('reset');
              }}
            >
              Already have a token?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="token" className={styles.label}>
              Password Reset Token
            </label>
            <input
              id="token"
              type="text"
              className="input-field"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the reset token here"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Secure Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
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
            {newPassword && (
              <PasswordStrengthMeter
                score={passwordStrength.score}
                label={passwordStrength.label}
                color={passwordStrength.color}
              />
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
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
            {loading ? 'Updating Password...' : 'Reset Password →'}
          </button>

          <div className={styles.footerRow}>
            <button
              type="button"
              className={styles.actionLink}
              onClick={() => {
                setError('');
                setStep('request');
              }}
            >
              ← Request a new token
            </button>
            <Link href="/login" className={styles.actionLink}>
              Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
