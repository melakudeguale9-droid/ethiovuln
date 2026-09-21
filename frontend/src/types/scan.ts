// EthioVuln — Type Definitions for Scans

export type ScanStatus = 'pending' | 'verifying' | 'running' | 'completed' | 'failed' | 'cancelled';
export type ScanType = 'full' | 'nuclei_only' | 'zap_only' | 'fuzz_only' | 'nuclei_zap';

export interface Scan {
  id: string;
  user_id: string;
  target_url: string;
  target_domain: string;
  status: ScanStatus;
  scan_type: ScanType;
  progress: number;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
  celery_task_id: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  vulnerabilities?: import('./vulnerability').Vulnerability[];
}

export interface ScanListResponse {
  scans: Scan[];
  total: number;
  page: number;
  page_size: number;
}

export interface ScanCreateRequest {
  target_url: string;
  scan_type: ScanType;
  tos_accepted: boolean;
}
