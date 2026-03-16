import api from '@/lib/api';

/* ============================================================
   TYPES
============================================================ */

export interface HospitalCapacity {
  beds?: number;
  ambulances?: number;
  responders?: number;
}

export interface HospitalLocation {
  lat: number;
  lng: number;
}

export interface NearbyHospitalsParams {
  lat: number;
  lng: number;
  radius?: number; // 1–50, default from backend
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year';

export interface DispatchPayload {
  incidentId: string;
  responderId: string;
}

/* ============================================================
   SERVICE
============================================================ */

export const hospitalService = {
  /**
   * GET /api/hospitals/dashboard
   * Protected — hospital only
   * Used by: HospitalDashboard
   */
  async getDashboard() {
    const { data } = await api.get('/hospitals/dashboard');
    return data.data;
  },

  /**
   * PUT /api/hospitals/capacity
   * Protected — hospital only
   * Used by: HospitalSettings
   */
  async updateCapacity(payload: HospitalCapacity) {
    const { data } = await api.put('/hospitals/capacity', payload);
    return data.data;
  },

  /**
   * GET /api/hospitals/incidents
   * Protected — hospital only
   * Used by: HospitalIncidents
   */
  async getIncidents(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await api.get('/hospitals/incidents', { params });
    return data.data;
  },

  /**
   * GET /api/hospitals/responders
   * Protected — hospital only
   * Used by: HospitalResponders
   */
  async getAvailableResponders() {
    const { data } = await api.get('/hospitals/responders');
    return data.data;
  },

  /**
   * POST /api/hospitals/dispatch
   * Protected — hospital only
   * Used by: HospitalIncidents / HospitalIncidentDetails
   */
  async dispatchResponder(payload: DispatchPayload) {
    const { data } = await api.post('/hospitals/dispatch', payload);
    return data.data;
  },

  /**
   * GET /api/hospitals/analytics?period=week
   * Protected — hospital only
   * Used by: HospitalAnalytics
   */
  async getAnalytics(period?: AnalyticsPeriod) {
    const { data } = await api.get('/hospitals/analytics', {
      params: period ? { period } : undefined,
    });
    return data.data;
  },

  /**
   * GET /api/hospitals/stats
   * Protected — hospital only
   * Used by: HospitalDashboard stats cards
   */
  async getStats() {
    const { data } = await api.get('/hospitals/stats');
    return data.data;
  },

  /**
   * GET /api/hospitals/:hospitalId/stats
   * Protected — admin only
   * Used by: AdminReports / AdminDashboard
   */
  async getHospitalStats(hospitalId: string) {
    const { data } = await api.get(`/hospitals/${hospitalId}/stats`);
    return data.data;
  },

  /**
   * PUT /api/hospitals/location
   * Protected — hospital only
   * Used by: HospitalSettings
   */
  async updateLocation(payload: HospitalLocation) {
    const { data } = await api.put('/hospitals/location', payload);
    return data.data;
  },

  /**
   * GET /api/hospitals/nearby?lat=&lng=&radius=
   * Public — no auth required
   * Used by: DriverEmergency (find nearest hospital)
   */
  async getNearby(params: NearbyHospitalsParams) {
    const { data } = await api.get('/hospitals/nearby', { params });
    return data.data;
  },
};