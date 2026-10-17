'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Scan } from '@/types/scan';
import { PageNav } from '@/components/navigation/PageNav';
import { Alert } from '@/components/ui/Alert';
import {
  TargetInputCard,
  ProfileSelector,
  SsrfGateNotice,
  DisclaimerModal,
} from '@/components/scans/new';

export default function NewScanPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState('full');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartScan = () => {
    if (!targetUrl.trim()) {
      setError('Please provide a target URL');
      return;
    }
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      setError('Target URL must start with http:// or https://');
      return;
    }
    setError('');
    setShowDisclaimer(true);
  };

  const handleAcceptAndScan = async () => {
    if (!tosAccepted) {
      setError('You must acknowledge authorization and accept the Terms of Service');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (!user?.tos_accepted_at) {
        await api.acceptTos();
        await refreshUser();
      }
      const scan = (await api.createScan(targetUrl, scanType, true)) as Scan;
      window.location.href = `/dashboard/scans/${scan.id}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to launch vulnerability scan');
      setShowDisclaimer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageNav backHref="/dashboard/scans" backLabel="Scans" title="Launch Assessment" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}
        >
          New Vulnerability Assessment
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 13 }}>
          Configure target parameters and choose an assessment profile for orchestrated security testing
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && <Alert type="error">{error}</Alert>}

          <TargetInputCard
            targetUrl={targetUrl}
            onChangeTargetUrl={setTargetUrl}
          />

          <ProfileSelector
            scanType={scanType}
            onSelectScanType={setScanType}
            onProceed={handleStartScan}
          />
        </div>

        {/* Right Column: SSRF Gate and Scope Notice */}
        <SsrfGateNotice />
      </div>

      {/* Legal Authorization Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        targetUrl={targetUrl}
        tosAccepted={tosAccepted}
        loading={loading}
        onChangeTosAccepted={setTosAccepted}
        onCancel={() => setShowDisclaimer(false)}
        onConfirm={handleAcceptAndScan}
      />
    </div>
  );
}
