'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { SCAN_STATUS_CONFIG } from '@/lib/constants';
import type { Scan } from '@/types/scan';
import type { Vulnerability, Severity } from '@/types/vulnerability';

export function useScanTelemetry(scanId: string) {
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');

  const ws = useWebSocket(scanId);

  // Poll scan data every 3 seconds while active
  useEffect(() => {
    let isMounted = true;
    const fetchScan = async () => {
      try {
        const data = (await api.getScan(scanId)) as Scan;
        if (isMounted) setScan(data);
      } catch (e) {
        console.error('Failed to poll scan:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchScan();
    const interval = setInterval(fetchScan, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [scanId]);

  const status = (scan?.status || ws.status || 'pending').toLowerCase();
  const isCompleted = status === 'completed';
  const progress = isCompleted ? 100 : (ws.progress > 0 ? ws.progress : (scan?.progress ?? 0));
  const statusConfig = SCAN_STATUS_CONFIG[status] || { label: status, color: '#94A3B8' };
  const isRunning = status === 'running' || status === 'verifying' || status === 'pending';

  const rawVulns: Vulnerability[] = ws.vulnerabilities.length > 0
    ? ws.vulnerabilities
    : (scan as any)?.vulnerabilities || [];

  const groupedVulns: Record<Severity, Vulnerability[]> = {
    critical: rawVulns.filter((v) => v.severity === 'critical'),
    high:     rawVulns.filter((v) => v.severity === 'high'),
    medium:   rawVulns.filter((v) => v.severity === 'medium'),
    low:      rawVulns.filter((v) => v.severity === 'low'),
    info:     rawVulns.filter((v) => v.severity === 'info'),
  };

  const filteredVulns = selectedSeverity === 'all'
    ? rawVulns
    : groupedVulns[selectedSeverity];

  const handleStopScan = async () => {
    if (!isRunning) return;
    try {
      await api.stopScan(scanId);
      ws.disconnect();
    } catch (e) {
      console.warn('Failed to stop scan:', e);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await api.downloadReport(scanId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EthioVuln_Report_${scan?.target_domain || 'assessment'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    }
  };

  return {
    scan,
    loading,
    ws,
    status,
    isCompleted,
    isRunning,
    progress,
    statusConfig,
    rawVulns,
    groupedVulns,
    filteredVulns,
    selectedSeverity,
    setSelectedSeverity,
    handleStopScan,
    handleDownloadReport,
  };
}
