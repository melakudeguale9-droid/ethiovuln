import React from 'react';
import Link from 'next/link';
import type { Scan } from '@/types/scan';
import { SeverityBadge } from '@/components/scans/SeverityBadge';
import { ScanStatusBadge } from '@/components/scans/ScanStatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './RecentScans.module.css';

export interface RecentScansProps {
  scans: Scan[];
  loading: boolean;
}

export function RecentScans({ scans, loading }: RecentScansProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Recent Scans</h2>
          <p className={styles.subtitle}>Latest vulnerability assessments</p>
        </div>
        {scans.length > 0 && (
          <Link href="/dashboard/scans" className={styles.viewAllLink}>
            View All →
          </Link>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={50} />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg className="w-7 h-7 drop-shadow-[0_0_8px_rgba(0,240,255,0.35)]" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L4 9V17C4 25.5 10 32.5 18 34.5C26 32.5 32 25.5 32 17V9L18 3Z" fill="#111827" stroke="#1E293B" strokeWidth="2" />
              <path d="M18 4L5 9.5V17C5 24.8 10.6 31.4 18 33.3V4Z" fill="#0284C7" />
              <path d="M18 4L31 9.5V17C31 24.8 25.4 31.4 18 33.3V4Z" fill="#F8FAFC" />
              <path d="M18 9L11 13V17C11 21.5 14 25.5 18 27V9Z" fill="#00F0FF" />
              <circle cx="23" cy="18" r="2" fill="#E11D48" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No Assessments Found</h3>
          <p className={styles.emptyDesc}>
            You haven&apos;t launched any vulnerability assessments yet. Configure your first
            authorized target domain to begin.
          </p>
          <Link href="/dashboard/scans/new" className={styles.emptyBtn}>
            Start New Assessment →
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Target Domain</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Severity Breakdown</th>
                <th className={`${styles.th} ${styles.thRight}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {scans.slice(0, 7).map((scan) => (
                <tr key={scan.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.tdDomain}>{scan.target_domain}</div>
                    <div className={styles.tdUrl}>{scan.target_url}</div>
                  </td>
                  <td className={`${styles.td} ${styles.tdDate}`}>
                    {new Date(scan.created_at).toLocaleDateString()}
                  </td>
                  <td className={styles.td}>
                    <ScanStatusBadge status={scan.status} />
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {scan.critical_count > 0 && (
                        <SeverityBadge severity="critical" count={scan.critical_count} />
                      )}
                      {scan.high_count > 0 && (
                        <SeverityBadge severity="high" count={scan.high_count} />
                      )}
                      {scan.medium_count > 0 && (
                        <SeverityBadge severity="medium" count={scan.medium_count} />
                      )}
                      {scan.critical_count === 0 &&
                        scan.high_count === 0 &&
                        scan.medium_count === 0 && (
                          <span className={styles.cleanText}>Clean</span>
                        )}
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.tdAction}`}>
                    <Link
                      href={`/dashboard/scans/${scan.id}`}
                      className={styles.actionLink}
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
