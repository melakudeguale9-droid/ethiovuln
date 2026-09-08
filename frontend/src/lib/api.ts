// EthioVuln — API Client

import { API_BASE_URL } from './constants';
import type { TokenResponse } from '@/types/user';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getHeaders(auth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (auth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    auth = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(auth),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...this.getHeaders(auth),
            ...options.headers,
          },
        });
        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status}`);
        }
        return retryResponse.json();
      }
      // Redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    // Handle PDF/binary responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return response.blob() as unknown as T;
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = typeof window !== 'undefined'
      ? localStorage.getItem('refresh_token')
      : null;
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const data: TokenResponse = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      return true;
    } catch {
      return false;
    }
  }

  // ─── Auth Endpoints ──────────────────────────────────────
  async login(email: string, password: string) {
    const data = await this.request<TokenResponse>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false
    );
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }

  async register(email: string, username: string, password: string, fullName?: string) {
    return this.request(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, username, password, full_name: fullName }),
      },
      false
    );
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  async acceptTos() {
    return this.request('/api/auth/accept-tos', {
      method: 'POST',
      body: JSON.stringify({ accepted: true }),
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  // ─── Scan Endpoints ──────────────────────────────────────
  async createScan(targetUrl: string, scanType: string, tosAccepted: boolean) {
    return this.request('/api/scans', {
      method: 'POST',
      body: JSON.stringify({
        target_url: targetUrl,
        scan_type: scanType,
        tos_accepted: tosAccepted,
      }),
    });
  }

  async listScans(page = 1, pageSize = 20) {
    return this.request(`/api/scans?page=${page}&page_size=${pageSize}`);
  }

  async getScan(scanId: string) {
    return this.request(`/api/scans/${scanId}`);
  }

  async stopScan(scanId: string) {
    return this.request(`/api/scans/${scanId}/stop`, { method: 'POST' });
  }

  async getScanVulnerabilities(scanId: string, severity?: string) {
    const params = severity ? `?severity=${severity}` : '';
    return this.request(`/api/scans/${scanId}/vulnerabilities${params}`);
  }

  // ─── Report Endpoints ────────────────────────────────────
  async listReports() {
    return this.request('/api/reports');
  }

  async downloadReport(scanId: string): Promise<Blob> {
    return this.request<Blob>(`/api/reports/${scanId}/pdf`);
  }
}

export const api = new ApiClient();
