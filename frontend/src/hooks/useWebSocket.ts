// EthioVuln — WebSocket Hook for Real-time Scan Updates

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_BASE_URL } from '@/lib/constants';
import type { Vulnerability } from '@/types/vulnerability';

interface LogEntry {
  message: string;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
}

interface ScanWSState {
  connected: boolean;
  logs: LogEntry[];
  progress: number;
  stage: string;
  vulnerabilities: Vulnerability[];
  status: string;
}

export function useWebSocket(scanId: string | null) {
  const [state, setState] = useState<ScanWSState>({
    connected: false,
    logs: [],
    progress: 0,
    stage: '',
    vulnerabilities: [],
    status: '',
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  const connect = useCallback(() => {
    if (!scanId) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const wsUrl = `${WS_BASE_URL}/api/ws/scans/${scanId}?token=${token}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setState(prev => ({ ...prev, connected: true }));
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'log':
              setState(prev => ({
                ...prev,
                logs: [...prev.logs, msg.data as LogEntry].slice(-500),
              }));
              break;

            case 'progress':
              setState(prev => ({
                ...prev,
                progress: msg.data.progress,
                stage: msg.data.stage || prev.stage,
              }));
              break;

            case 'vulnerability':
              setState(prev => ({
                ...prev,
                vulnerabilities: [...prev.vulnerabilities, msg.data as Vulnerability],
              }));
              break;

            case 'status':
              setState(prev => ({
                ...prev,
                status: msg.data.status,
              }));
              break;

            case 'connected':
              setState(prev => ({
                ...prev,
                logs: [...prev.logs, {
                  message: msg.data.message,
                  level: 'info',
                  timestamp: new Date().toISOString(),
                }],
              }));
              break;

            case 'ping':
              ws.send(JSON.stringify({ type: 'pong' }));
              break;
          }
        } catch (e) {
          console.error('WebSocket message parse error:', e);
        }
      };

      ws.onclose = () => {
        setState(prev => ({ ...prev, connected: false }));
        wsRef.current = null;

        // Auto-reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.error('WebSocket connection error:', e);
    }
  }, [scanId]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectAttemptsRef.current = maxReconnectAttempts; // prevent reconnect
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  return { ...state, disconnect };
}
