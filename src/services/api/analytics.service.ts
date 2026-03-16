import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const analyticsService = {
  getResponseTimes: (params?: { from?: string; to?: string }) =>
    axiosInstance.get(API_ENDPOINTS.HOSPITAL_ANALYTICS, { params }),

  getIncidentTrends: (params?: { from?: string; to?: string; granularity?: string }) =>
    axiosInstance.get(API_ENDPOINTS.HOSPITAL_ANALYTICS, { params }),

  getPerformanceMetrics: () =>
    axiosInstance.get(API_ENDPOINTS.HOSPITAL_ANALYTICS),
};