import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const analyticsService = {
  getResponseTimes: (params?: { from?: string; to?: string }) =>
    axiosInstance.get(API_ENDPOINTS.ANALYTICS_RESPONSE_TIMES, { params }),

  getIncidentTrends: (params?: { from?: string; to?: string; granularity?: string }) =>
    axiosInstance.get(API_ENDPOINTS.ANALYTICS_INCIDENT_TRENDS, { params }),

  getPerformanceMetrics: () =>
    axiosInstance.get(API_ENDPOINTS.ANALYTICS_PERFORMANCE),
};
