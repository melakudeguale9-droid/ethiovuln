'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { WebSocketLog } from '@/hooks/useWebSocket';
import styles from './ConsoleStream.module.css';

export interface ConsoleStreamProps {
  logs: WebSocketLog[];
  connected: boolean;
  status?: string;
}

export function ConsoleStream({ logs, connected, status }: ConsoleStreamProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const isCompleted = status?.toLowerCase() === 'completed';
  const isRunning = status?.toLowerCase() === 'running' || status?.toLowerCase() === 'verifying';

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.title}>Console Stream</span>
          <span
            className={styles.liveTag}
            style={{
              color: isCompleted ? '#00e5ff' : connected ? '#10B981' : '#64748B',
              background: isCompleted
                ? 'rgba(0, 229, 255, 0.1)'
                : connected
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(100, 116, 139, 0.1)',
              border: isCompleted
                ? '1px solid rgba(0, 229, 255, 0.3)'
                : connected
                ? '1px solid rgba(16, 185, 129, 0.25)'
                : '1px solid rgba(100, 116, 139, 0.2)',
            }}
          >
            {isCompleted ? '✓ COMPLETED' : connected ? '● LIVE' : isRunning ? '⏳ QUEUED' : '○ IDLE'}
          </span>
        </div>

        {/* Auto-Scroll Toggle */}
        <label className={styles.autoScrollLabel}>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className={styles.checkbox}
          />
          Auto-scroll
        </label>
      </div>

      <div ref={logContainerRef} className={`log-stream ${styles.logContainer}`}>
        {logs.length === 0 ? (
          <div className={styles.emptyLogs}>
            {isCompleted ? 'Assessment completed · Stream finished' : 'Waiting for engine logs...'}
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={`log-line log-${log.level}`} style={{ fontSize: 11 }}>
              <span className={styles.timestamp}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConsoleStream;
