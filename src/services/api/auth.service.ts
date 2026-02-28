import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";

export const authService = {
  login: (data: LoginRequest) =>
    axiosInstance.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.LOGIN, data),

  register: (data: RegisterRequest) =>
    axiosInstance.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.REGISTER, data),

  logout: () =>
    axiosInstance.post(API_ENDPOINTS.LOGOUT),

  getMe: () =>
    axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.ME),

  forgotPassword: (email: string) =>
    axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, { token, password }),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken }),
};
