'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageNav } from '@/components/navigation/PageNav';
import { Skeleton } from '@/components/ui/Skeleton';
import { useScanTelemetry } from '@/hooks/useScanTelemetry';
import {
  ScanHeader,
  ProgressStageCard,
  SeverityCounters,
  ConsoleStream,
  VulnerabilityAccordion,
} from '@/components/scans/live';

export default function ScanDetailPage() {
  const params = useParams();
  const scanId = params.id as string;

  const {
    scan,
    loading,
    ws,
    isRunning,
    isCompleted,
    progress,
    statusConfig,
    groupedVulns,
    filteredVulns,
    selectedSeverity,
    setSelectedSeverity,
    handleStopScan,
    handleDownloadReport,
  } = useScanTelemetry(scanId);

  if (loading) {
    return (
      <div>
        <Skeleton width={320} height={36} style={{ marginBottom: 16 }} />
        <Skeleton height={140} style={{ marginBottom: 16 }} />
        <Skeleton height={400} />
      </div>
    );
  }

  return (
    <div>
      <PageNav
        backHref="/dashboard/scans"
        backLabel="Scans"
        title={scan?.target_domain || 'Scan Telemetry'}
      />

      {/* ─── Header: Domain, Status Pill & Action Buttons ─────── */}
      <ScanHeader
        targetDomain={scan?.target_domain}
        targetUrl={scan?.target_url}
        isRunning={isRunning}
        isCompleted={isCompleted}
        statusConfig={statusConfig}
        onStopScan={handleStopScan}
        onDownloadReport={handleDownloadReport}
      />

      {/* ─── Progress & Current Stage Telemetry ──────────────── */}
      <ProgressStageCard
        stage={ws.stage}
        isCompleted={isCompleted}
        isRunning={isRunning}
        progress={progress}
      />

      {/* ─── Severity Filter Counters (Critical to Info) ─────── */}
      <SeverityCounters
        groupedVulns={groupedVulns}
        selectedSeverity={selectedSeverity}
        onSelectSeverity={setSelectedSeverity}
      />

      {/* ─── 2-Column Grid: Console Stream & Findings Accordion ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1fr) minmax(380px, 1.2fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <ConsoleStream logs={ws.logs} connected={ws.connected} />
        <VulnerabilityAccordion
          filteredVulns={filteredVulns}
          selectedSeverity={selectedSeverity}
          onClearFilter={() => setSelectedSeverity('all')}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
}
