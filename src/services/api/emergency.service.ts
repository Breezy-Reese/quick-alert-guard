import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { ApiResponse, EmergencyAlert, Location } from "@/types";

export const emergencyService = {
  triggerEmergency: (data: { type: string; location: Location }) =>
    axiosInstance.post<ApiResponse<EmergencyAlert>>(API_ENDPOINTS.EMERGENCY_TRIGGER, data),

  cancelEmergency: (id: string) =>
    axiosInstance.post(API_ENDPOINTS.EMERGENCY_CANCEL(id)),

  getAlerts: () =>
    axiosInstance.get<ApiResponse<EmergencyAlert[]>>(API_ENDPOINTS.EMERGENCY_ALERTS),

  getAlertById: (id: string) =>
    axiosInstance.get<ApiResponse<EmergencyAlert>>(API_ENDPOINTS.EMERGENCY_ALERT_BY_ID(id)),
};
