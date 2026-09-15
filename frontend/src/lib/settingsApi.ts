// EthioVuln — Settings API Client

import { api } from './api';

export const settingsApi = {
  // Profile
  getProfile: () => api.request('/api/settings/profile'),
  updateProfile: (data: { full_name?: string; username?: string; email?: string }) =>
    api.request('/api/settings/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  // Preferences
  getPreferences: () => api.request('/api/settings/preferences'),
  updatePreferences: (data: Record<string, unknown>) =>
    api.request('/api/settings/preferences', { method: 'PATCH', body: JSON.stringify(data) }),

  // API Keys
  listApiKeys: () => api.request('/api/settings/api-keys'),
  createApiKey: (name: string) =>
    api.request('/api/settings/api-keys', { method: 'POST', body: JSON.stringify({ name }) }),
  revokeApiKey: (id: string) =>
    api.request(`/api/settings/api-keys/${id}`, { method: 'DELETE' }),

  // Login History
  getLoginHistory: () => api.request('/api/settings/login-history'),

  // Export
  exportData: () => api.request('/api/settings/export'),

  // Danger Zone
  deleteScanHistory: () =>
    api.request('/api/settings/scan-history', { method: 'DELETE', body: JSON.stringify({ confirm: true }) }),
  deleteAccount: (password: string) =>
    api.request('/api/settings/account', { method: 'DELETE', body: JSON.stringify({ password, confirm: true }) }),
};
