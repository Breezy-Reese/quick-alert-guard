import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { Ambulance, AmbulanceStatus, ApiResponse, HospitalStats, Incident, PaginatedResponse, Responder } from "@/types";

export const hospitalService = {
  getStats: () =>
    axiosInstance.get<ApiResponse<HospitalStats>>(API_ENDPOINTS.HOSPITAL_STATS),

  // Incidents
  getIncidents: (params?: { page?: number; status?: string; severity?: string }) =>
    axiosInstance.get<PaginatedResponse<Incident>>(API_ENDPOINTS.INCIDENTS, { params }),

  getIncidentById: (id: string) =>
    axiosInstance.get<ApiResponse<Incident>>(API_ENDPOINTS.INCIDENT_BY_ID(id)),

  assignIncident: (id: string, data: { ambulanceId: string; responderId: string }) =>
    axiosInstance.post(API_ENDPOINTS.INCIDENT_ASSIGN(id), data),

  resolveIncident: (id: string) =>
    axiosInstance.post(API_ENDPOINTS.INCIDENT_RESOLVE(id)),

  // Ambulances
  getAmbulances: () =>
    axiosInstance.get<ApiResponse<Ambulance[]>>(API_ENDPOINTS.AMBULANCES),

  dispatchAmbulance: (id: string, incidentId: string) =>
    axiosInstance.post(API_ENDPOINTS.AMBULANCE_DISPATCH(id), { incidentId }),

  updateAmbulanceStatus: (id: string, status: AmbulanceStatus) =>
    axiosInstance.patch(API_ENDPOINTS.AMBULANCE_STATUS(id), { status }),

  // Responders
  getResponders: () =>
    axiosInstance.get<ApiResponse<Responder[]>>(API_ENDPOINTS.RESPONDERS),

  assignResponder: (id: string, incidentId: string) =>
    axiosInstance.post(API_ENDPOINTS.RESPONDER_ASSIGN(id), { incidentId }),
};
