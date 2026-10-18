'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Scan } from '@/types/scan';
import { PageNav } from '@/components/navigation/PageNav';
import { Alert } from '@/components/ui/Alert';
import { useScanConfigurator } from '@/hooks/useScanConfigurator';
import {
  TargetInputCard,
  AssessmentModes,
  ModuleTreeViewer,
  CustomConfigurator,
  SsrfGateNotice,
  DisclaimerModal,
} from '@/components/scans/new';

function NewScanContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') || 'full_enterprise';

  const { user, refreshUser } = useAuth();
  const [targetUrl, setTargetUrl] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    categories,
    activeCategory,
    selectedCategoryId,
    setSelectedCategoryId,
    customOptions,
    selectedModules,
    toggleModule,
    selectAllModules,
    deselectAllModules,
    selectedModulesCount,
    resolvedBackendEngine,
  } = useScanConfigurator(initialMode);

  const handleStartScan = () => {
    if (!targetUrl.trim()) {
      setError('Please provide a target URL');
      return;
    }
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      setError('Target URL must start with http:// or https://');
      return;
    }
    if (selectedCategoryId === 'custom_config' && selectedModulesCount === 0) {
      setError('Please select at least one module from the custom configuration checklist');
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
      const scan = (await api.createScan(
        targetUrl,
        resolvedBackendEngine,
        true
      )) as Scan;
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
          Configure target parameters and select automated scanning scopes from the 8-tier assessment taxonomy
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

          {/* 1. Target URL Input */}
          <TargetInputCard
            targetUrl={targetUrl}
            onChangeTargetUrl={setTargetUrl}
          />

          {/* 2. Assessment Modes (Categories 1 through 8) */}
          <div className="glass-card" style={{ padding: 24 }}>
            <AssessmentModes
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />

            {/* If Mode 8 (Custom Config) is chosen, display checklist */}
            {selectedCategoryId === 'custom_config' ? (
              <div style={{ marginTop: 20 }}>
                <CustomConfigurator
                  options={customOptions}
                  selectedModules={selectedModules}
                  onToggleModule={toggleModule}
                  onSelectAll={selectAllModules}
                  onDeselectAll={deselectAllModules}
                  selectedCount={selectedModulesCount}
                />
              </div>
            ) : (
              /* If Modes 1 - 7 are chosen, display detailed inspection tree */
              <div style={{ marginTop: 20 }}>
                <ModuleTreeViewer category={activeCategory} />
              </div>
            )}

            {/* Launch Assessment Action */}
            <div style={{ marginTop: 24 }}>
              <button
                className="btn-glow btn-glow-cyan"
                onClick={handleStartScan}
                style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700 }}
              >
                Proceed to Launch {activeCategory.title} →
              </button>
            </div>
          </div>
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

export default function NewScanPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '40px 20px', color: '#94A3B8', textAlign: 'center' }}>
          Loading Assessment Configurator...
        </div>
      }
    >
      <NewScanContent />
    </Suspense>
  );
}

