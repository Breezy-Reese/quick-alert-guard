import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { AdminStats, ApiResponse, PaginatedResponse, SystemHealth, SystemLog, User, UserRole } from "@/types";

export const adminService = {
  getStats: () =>
    axiosInstance.get<ApiResponse<AdminStats>>(API_ENDPOINTS.ADMIN_STATS),

  getSystemHealth: () =>
    axiosInstance.get<ApiResponse<SystemHealth>>(API_ENDPOINTS.ADMIN_SYSTEM_HEALTH),

  getLogs: (params?: { page?: number; level?: string; source?: string; search?: string }) =>
    axiosInstance.get<PaginatedResponse<SystemLog>>(API_ENDPOINTS.ADMIN_LOGS, { params }),

  getUsers: (params?: { page?: number; role?: UserRole; search?: string }) =>
    axiosInstance.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS, { params }),

  getUserById: (id: string) =>
    axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.USER_BY_ID(id)),

  updateUserRole: (id: string, role: UserRole) =>
    axiosInstance.patch(API_ENDPOINTS.USER_ROLE(id), { role }),

  getReports: () =>
    axiosInstance.get(API_ENDPOINTS.ADMIN_REPORTS),
};
