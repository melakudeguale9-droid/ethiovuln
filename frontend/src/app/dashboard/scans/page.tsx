// EthioVuln — Scan History Page
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Scan, ScanListResponse } from '@/types/scan';
import { PageNav } from '@/components/navigation/PageNav';
import { ScanRow } from '@/components/scans/ScanRow';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 15;

  useEffect(() => {
    const fetchScans = async () => {
      setLoading(true);
      try {
        const data = (await api.listScans(page, pageSize)) as ScanListResponse;
        setScans(data.scans);
        setTotal(data.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <PageNav
        backHref="/dashboard"
        backLabel="Overview"
        title="Scans"
        nextHref="/dashboard/scans/new"
        nextLabel="New Scan"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            <span className="text-gradient">Scan History</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>{total} total scans</p>
        </div>
        <Link href="/dashboard/scans/new" className="btn-glow btn-glow-green" style={{ textDecoration: 'none', fontSize: 14 }}>
          ＋ New Scan
        </Link>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Type</th>
              <th>Status</th>
              <th>Vulns</th>
              <th>Critical</th>
              <th>High</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))
            ) : scans.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                  No scans found. Start your first scan to see results here.
                </td>
              </tr>
            ) : (
              scans.map((scan) => <ScanRow key={scan.id} scan={scan} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            className="btn-outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            ← Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 13, color: '#94a3b8' }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
