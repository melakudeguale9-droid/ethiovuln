// EthioVuln — Scan History Page

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SCAN_STATUS_CONFIG, SCAN_TYPE_LABELS } from '@/lib/constants';
import type { Scan, ScanListResponse } from '@/types/scan';

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
        const data = await api.listScans(page, pageSize) as ScanListResponse;
        setScans(data.scans);
        setTotal(data.total);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchScans();
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
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
                    <td key={j}><div className="skeleton" style={{ height: 20 }} /></td>
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
              scans.map(scan => {
                const statusCfg = SCAN_STATUS_CONFIG[scan.status] || { label: scan.status, color: '#94a3b8' };
                return (
                  <tr key={scan.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: '#f1f5f9' }}>{scan.target_domain}</div>
                      <div style={{ fontSize: 11, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {scan.target_url}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: 12 }}>
                      {SCAN_TYPE_LABELS[scan.scan_type] || scan.scan_type}
                    </td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: statusCfg.color,
                        background: `${statusCfg.color}15`, padding: '3px 10px',
                        borderRadius: 9999, border: `1px solid ${statusCfg.color}30`,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                        {scan.status === 'running' && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
                        {statusCfg.label}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{scan.total_vulnerabilities}</td>
                    <td style={{ color: scan.critical_count > 0 ? '#ff0040' : '#64748b', fontWeight: 600 }}>
                      {scan.critical_count}
                    </td>
                    <td style={{ color: scan.high_count > 0 ? '#ff4444' : '#64748b', fontWeight: 600 }}>
                      {scan.high_count}
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: 13 }}>
                      {new Date(scan.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link href={`/dashboard/scans/${scan.id}`}
                        style={{ color: '#00ff88', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button className="btn-outline" disabled={page <= 1}
            onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', fontSize: 13 }}>
            ← Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: 14 }}>
            Page {page} of {totalPages}
          </span>
          <button className="btn-outline" disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', fontSize: 13 }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
