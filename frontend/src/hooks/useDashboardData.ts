'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Scan, ScanListResponse } from '@/types/scan';

export interface SeverityItem {
  label: string;
  count: number;
  color: string;
}

export interface DonutSegment extends SeverityItem {
  percentage: number;
  dasharray: string;
  dashoffset: number;
}

export function useDashboardData() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = (await api.listScans(1, 50)) as ScanListResponse;
        if (isMounted) {
          setScans(data.scans || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard scans:', e);
        if (isMounted) setScans([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalScans = scans.length;
  const uniqueTargets = new Set(scans.map((s) => s.target_domain).filter(Boolean)).size;
  const activeScans = scans.filter((s) => s.status === 'running' || s.status === 'verifying').length;
  const totalVulns = scans.reduce((sum, s) => sum + (s.total_vulnerabilities || 0), 0);
  const totalCritical = scans.reduce((sum, s) => sum + (s.critical_count || 0), 0);
  const totalHigh = scans.reduce((sum, s) => sum + (s.high_count || 0), 0);
  const criticalHighCount = totalCritical + totalHigh;
  const totalMedium = scans.reduce((sum, s) => sum + (s.medium_count || 0), 0);
  const totalLow = scans.reduce((sum, s) => sum + (s.low_count || 0), 0);
  const totalInfo = scans.reduce((sum, s) => sum + (s.info_count || 0), 0);

  const severityBreakdown: SeverityItem[] = [
    { label: 'Critical', count: totalCritical, color: '#EF4444' },
    { label: 'High', count: totalHigh, color: '#F59E0B' },
    { label: 'Medium', count: totalMedium, color: '#3B82F6' },
    { label: 'Low', count: totalLow, color: '#10B981' },
    { label: 'Info', count: totalInfo, color: '#0EA5E9' },
  ];

  let cumulativeOffset = 0;
  const totalVulnsForChart = totalVulns > 0 ? totalVulns : 1;
  const donutSegments: DonutSegment[] = severityBreakdown.map((item) => {
    const percentage = (item.count / totalVulnsForChart) * 100;
    const dasharray = `${percentage} ${100 - percentage}`;
    const dashoffset = 25 - cumulativeOffset;
    cumulativeOffset += percentage;
    return { ...item, percentage, dasharray, dashoffset };
  });

  return {
    scans,
    loading,
    totalScans,
    uniqueTargets,
    activeScans,
    totalVulns,
    totalCritical,
    totalHigh,
    criticalHighCount,
    totalMedium,
    totalLow,
    totalInfo,
    severityBreakdown,
    donutSegments,
  };
}
