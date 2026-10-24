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

    if (response.status === 402) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.detail ||
        errorData.message ||
        'Your 7-day free trial has expired. Please select a Monthly or Annual package to continue.';

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('trial_expired_toast', message);
        if (!window.location.href.includes('/dashboard/settings?tab=billing')) {
          window.location.href = '/dashboard/settings?tab=billing&trial_expired=true';
        }
      }
      throw new Error(message);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let message = errorData.detail || errorData.message || (typeof errorData === 'string' ? errorData : null);
      if (!message) {
        if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
          message = 'Backend API service is temporarily unreachable (HTTP 500). Please ensure the backend server is running.';
        } else {
          message = `API Error: ${response.status}`;
        }
      }
      throw new Error(message);
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
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username'
    formData.append('password', password);

    const data = await this.request<TokenResponse>(
      '/api/auth/login',
      { 
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      },
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

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string; reset_token?: string }>(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false
    );
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request<{ message: string }>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({ token, new_password: newPassword }),
      },
      false
    );
  }

  async getSubscription() {
    return this.request<{
      subscription_tier: string;
      trial_ends_at: string | null;
      is_trial_expired: boolean;
      days_remaining: number;
      created_at: string | null;
    }>('/api/settings/subscription');
  }

  async upgradeSubscription(tier: string) {
    return this.request<{ message: string; subscription_tier: string }>(
      '/api/settings/subscription/upgrade',
      {
        method: 'POST',
        body: JSON.stringify({ tier }),
      }
    );
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

  // ─── AI / Gemini Endpoints ────────────────────────────────
  async getAiStatus(): Promise<GeminiStatusResponse> {
    return this.request<GeminiStatusResponse>('/api/ai/status');
  }

  async pingGemini(): Promise<GeminiPingResponse> {
    return this.request<GeminiPingResponse>('/api/ai/ping', {
      method: 'POST',
    });
  }

  async generateAiResponse(payload: GeminiGenerateRequest): Promise<GeminiGenerateResponse> {
    return this.request<GeminiGenerateResponse>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async chatWithAi(payload: GeminiChatRequest): Promise<GeminiChatResponse> {
    return this.request<GeminiChatResponse>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export interface GeminiStatusResponse {
  configured: boolean;
  model: string;
}

export interface GeminiPingResponse {
  success: boolean;
  configured: boolean;
  message: string;
  model: string;
  latency_ms: number;
}

export interface GeminiGenerateRequest {
  prompt: string;
  system_instruction?: string;
  context?: string;
}

export interface GeminiGenerateResponse {
  success: boolean;
  configured: boolean;
  response: string;
  model: string;
  latency_ms: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface GeminiChatRequest {
  messages: ChatMessage[];
  context?: string;
  system_instruction?: string;
}

export interface GeminiChatResponse {
  success: boolean;
  configured: boolean;
  role: string;
  response: string;
  model: string;
  latency_ms: number;
}

export const api = new ApiClient();
