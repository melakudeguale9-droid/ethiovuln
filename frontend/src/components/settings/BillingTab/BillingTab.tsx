'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Alert } from '@/components/ui/Alert';
import styles from './BillingTab.module.css';

interface SubscriptionData {
  subscription_tier: string;
  trial_ends_at: string | null;
  is_trial_expired: boolean;
  days_remaining: number;
  created_at: string | null;
}

export function BillingTab() {
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await api.getSubscription();
      setSub(data);
    } catch {
      // Fallback default
      setSub({
        subscription_tier: 'Free',
        trial_ends_at: null,
        is_trial_expired: false,
        days_remaining: 7,
        created_at: null,
      });
    }
  };

  const handleUpgrade = async (tier: string) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.upgradeSubscription(tier);
      setSuccessMsg(res.message || `Successfully activated ${tier} package!`);
      // Clear any expired notice from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('trial_expired_toast');
      }
      await loadSubscription();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upgrade request failed');
    } finally {
      setLoading(false);
    }
  };

  const currentTier = sub?.subscription_tier || 'Free';
  const isFree = currentTier.toLowerCase() === 'free' || currentTier.toLowerCase() === 'trial';
  const isExpired = sub?.is_trial_expired ?? false;
  const isMonthlyActive = currentTier.toLowerCase() === 'monthly' || currentTier.toLowerCase() === 'pro monthly';
  const isAnnualActive = currentTier.toLowerCase() === 'annual' || currentTier.toLowerCase() === 'pro annual';

  return (
    <div className={styles.container}>
      {successMsg && (
        <Alert type="success">{successMsg}</Alert>
      )}
      {errorMsg && (
        <Alert type="error">{errorMsg}</Alert>
      )}

      {/* ── Current Subscription Status Card ─────────────────────────── */}
      <div className={styles.currentPlanCard}>
        <div className={styles.planInfo}>
          <span className={styles.planLabel}>Active Subscription Overview</span>
          <div className={styles.planNameRow}>
            <span className={styles.planName}>
              {currentTier} {isFree ? 'Trial' : 'Plan'}
            </span>
            {isFree ? (
              isExpired ? (
                <span className={styles.badgeExpired}>⚠️ 7-Day Trial Expired</span>
              ) : (
                <span className={styles.badgeTrial}>
                  ⏳ {sub?.days_remaining ?? 7} Days Left in Free Trial
                </span>
              )
            ) : (
              <span className={styles.badgeActive}>✓ Active Subscription</span>
            )}
          </div>
          <p className={styles.planSubtext}>
            {isFree
              ? isExpired
                ? 'Your 7-day evaluation window has concluded. Select a Monthly or Annual subscription package below to re-enable automated vulnerability scanning, PDF report downloads, and AI mitigation patches.'
                : `You are currently evaluating EthioVuln on the 7-day free trial. You have ${sub?.days_remaining ?? 7} days remaining to test all scanning engines before choosing a plan.`
              : `Your ${currentTier} package is in good standing. You have full, unrestricted access to dynamic scanning engines, custom wordlists, and security intelligence tools.`}
          </p>
        </div>
      </div>

      {/* ── Billing Cycle Toggle ────────────────────────────────────── */}
      <div className={styles.billingToggleWrapper}>
        <span
          className={`${styles.toggleLabel} ${billingCycle === 'monthly' ? styles.toggleLabelActive : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly Billing
        </span>
        <div
          className={styles.toggleSwitch}
          onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'annual' : 'monthly'))}
        >
          <div
            className={styles.toggleThumb}
            style={{
              transform: billingCycle === 'annual' ? 'translateX(22px)' : 'translateX(0)',
            }}
          />
        </div>
        <span
          className={`${styles.toggleLabel} ${billingCycle === 'annual' ? styles.toggleLabelActive : ''}`}
          onClick={() => setBillingCycle('annual')}
        >
          Annual Billing
        </span>
        <span className={styles.discountPill}>Save 20%</span>
      </div>

      {/* ── Pricing Tiers Grid ─────────────────────────────────────── */}
      <div className={styles.grid}>
        {/* Tier 1: Free Starter */}
        <div className={styles.tierCard}>
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.tierTitle}>Free Evaluation</h3>
              <p className={styles.tierDescription}>
                7-day trial for cybersecurity students and individual researchers.
              </p>
            </div>
            <div className={styles.pricingRow}>
              <span className={styles.priceAmount}>$0</span>
              <span className={styles.pricePeriod}>/ 7 days</span>
            </div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Automated DAST Target Verification</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>ZAP Spider + Nuclei Templates (Trial Scope)</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Live Telemetry WebSocket Stream</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Standard Severity Filtering</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={`${styles.actionBtn} ${isFree ? styles.actionBtnActive : styles.actionBtnSecondary}`}
            disabled={isFree}
          >
            {isFree ? (isExpired ? 'Trial Expired' : 'Current Plan') : 'Free Trial'}
          </button>
        </div>

        {/* Tier 2: Monthly Pro */}
        <div className={`${styles.tierCard} ${billingCycle === 'monthly' ? styles.tierCardPopular : ''}`}>
          {billingCycle === 'monthly' && (
            <span className={styles.popularBadge}>Most Flexible</span>
          )}
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.tierTitle}>Monthly Professional</h3>
              <p className={styles.tierDescription}>
                Full security assessment engine for security teams and growing infrastructure.
              </p>
            </div>
            <div className={styles.pricingRow}>
              <span className={styles.priceAmount}>$49</span>
              <span className={styles.pricePeriod}>/ month (2,900 ETB)</span>
            </div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Unlimited Full Scans (Nuclei + ZAP + Fuzzer)</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Full Executive & Technical PDF Reports</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Google GenAI Automated Mitigation Patches</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Custom Wordlist Fuzzing & Subdomains</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Standard SLA & Vulnerability Notifications</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={`${styles.actionBtn} ${isMonthlyActive ? styles.actionBtnActive : styles.actionBtnPrimary}`}
            disabled={loading || isMonthlyActive}
            onClick={() => handleUpgrade('Monthly')}
          >
            {isMonthlyActive ? '✓ Currently Active' : loading ? 'Activating...' : 'Activate Monthly Plan →'}
          </button>
        </div>

        {/* Tier 3: Annual Enterprise Suite */}
        <div className={`${styles.tierCard} ${billingCycle === 'annual' ? styles.tierCardPopular : ''}`}>
          {billingCycle === 'annual' && (
            <span className={styles.popularBadge}>Best Value • Save 20%</span>
          )}
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.tierTitle}>Annual Security Suite</h3>
              <p className={styles.tierDescription}>
                Complete institutional offensive & defensive security platform.
              </p>
            </div>
            <div className={styles.pricingRow}>
              <span className={styles.priceAmount}>$39</span>
              <span className={styles.pricePeriod}>/ month billed annually</span>
            </div>
            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Everything in Monthly Professional</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Priority Celery Scanner Execution Queue</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Multi-Target Scope Management & VPN Tunnels</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Full REST API Keys for CI/CD DevSecOps</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>Dedicated Technical & Threat Support</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={`${styles.actionBtn} ${isAnnualActive ? styles.actionBtnActive : styles.actionBtnPrimary}`}
            disabled={loading || isAnnualActive}
            onClick={() => handleUpgrade('Annual')}
          >
            {isAnnualActive ? '✓ Currently Active' : loading ? 'Activating...' : 'Activate Annual Plan →'}
          </button>
        </div>
      </div>
    </div>
  );
}
