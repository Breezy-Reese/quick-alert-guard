import api from '@/lib/api';

/* ============================================================
   TYPES
============================================================ */

export interface AdminPaginationParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export interface AuditLogParams extends AdminPaginationParams {
  actorRole?: string;
  action?: string;
  actorId?: string;
  from?: string;
  to?: string;
}

export interface IncidentFilterParams extends AdminPaginationParams {
  status?: string;
  severity?: string;
}

export type ExportType = 'incidents' | 'audit_log' | 'driver_scores' | 'notifications' | 'users' | 'trips';
export type ExportFormat = 'csv' | 'pdf';

export interface CreateExportPayload {
  type: ExportType;
  format?: ExportFormat;
  filters?: Record<string, unknown>;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

/* ============================================================
   SERVICE
============================================================ */

export const adminService = {
  // ── Dashboard ──────────────────────────────────────────────

  /**
   * GET /api/admin/dashboard
   * Returns stats directly (no extra unwrapping needed in components)
   */
  async getDashboardStats() {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },

  // Alias — AdminDashboard.tsx calls getStats()
  async getStats() {
    const { data } = await api.get('/admin/dashboard');
    return data.data;
  },

  // ── Users ──────────────────────────────────────────────────

  /**
   * GET /api/admin/users
   */
  async getAllUsers(params?: AdminPaginationParams) {
    const { data } = await api.get('/admin/users', { params });
    return data.data;
  },

  // Alias — AdminUsers.tsx calls getUsers()
  async getUsers(params?: AdminPaginationParams) {
    const { data } = await api.get('/admin/users', { params });
    return data.data;
  },

  async getUserById(id: string) {
    const { data } = await api.get(`/admin/users/${id}`);
    return data.data;
  },

  async updateUser(id: string, payload: UpdateUserPayload) {
    const { data } = await api.put(`/admin/users/${id}`, payload);
    return data.data;
  },

  async toggleUserStatus(id: string) {
    const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
    return data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  // ── Incidents ──────────────────────────────────────────────

  async getAllIncidents(params?: IncidentFilterParams) {
    const { data } = await api.get('/admin/incidents', { params });
    return data.data;
  },

  // ── Audit Log ──────────────────────────────────────────────

  async getAuditLog(params?: AuditLogParams) {
    const { data } = await api.get('/admin/audit-log', { params });
    return data.data;
  },

  // Alias — AdminLogs.tsx calls getLogs()
  async getLogs(params?: AuditLogParams) {
    const { data } = await api.get('/admin/audit-log', { params });
    return data.data;
  },

  // ── Exports ────────────────────────────────────────────────

  async getExportJobs(params?: AdminPaginationParams) {
    const { data } = await api.get('/admin/exports', { params });
    return data.data;
  },

  async createExportJob(payload: CreateExportPayload) {
    const { data } = await api.post('/admin/exports', payload);
    return data.data;
  },

  async getExportJobById(id: string) {
    const { data } = await api.get(`/admin/exports/${id}`);
    return data.data;
  },

  async downloadExport(id: string): Promise<Blob> {
    const response = await api.get(`/admin/exports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ── System ─────────────────────────────────────────────────

  async getSystemHealth() {
    const { data } = await api.get('/admin/system/health');
    return data.data;
  },

  async getSystemReports() {
    const { data } = await api.get('/admin/reports');
    return data.data;
  },
};
