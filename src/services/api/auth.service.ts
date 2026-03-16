import axiosInstance from "@/config/axios.config";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/* ============================================================
   TYPES
============================================================ */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'driver' | 'hospital' | 'admin' | 'responder';
  phone: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  licenseNumber?: string;
  hospitalName?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'driver' | 'hospital' | 'responder';
  phone: string;
  licenseNumber?: string;
  hospitalName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Backend response shape: { success, data: { user, accessToken, refreshToken } }
interface AuthApiResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// GET /auth/me response shape: { success, data: <user> }
interface ProfileApiResponse {
  success: boolean;
  data: User;
}

/* ============================================================
   SERVICE
============================================================ */

export const authService = {
  /**
   * POST /api/auth/register
   */
  async register(payload: RegisterPayload): Promise<User> {
    const res = await axiosInstance.post<AuthApiResponse>(API_ENDPOINTS.REGISTER, payload);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    localStorage.setItem('refreshToken', res.data.data.refreshToken);
    return res.data.data.user;
  },

  /**
   * POST /api/auth/login
   */
  async login(payload: LoginPayload): Promise<User> {
    const res = await axiosInstance.post<AuthApiResponse>(API_ENDPOINTS.LOGIN, payload);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    localStorage.setItem('refreshToken', res.data.data.refreshToken);
    return res.data.data.user;
  },

  /**
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  /**
   * GET /api/auth/me
   * Returns { success, data: <user> } — user is directly under data
   */
  async getMe(): Promise<User> {
    const res = await axiosInstance.get<ProfileApiResponse>(API_ENDPOINTS.ME);
    return res.data.data;
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, payload);
    return res.data;
  },

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, payload);
    return res.data;
  },

  /**
   * POST /api/auth/change-password
   */
  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, payload);
    return res.data;
  },

  /**
   * POST /api/auth/refresh-token
   * Backend expects { refreshToken } in body
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const res = await axiosInstance.post<AuthApiResponse>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    localStorage.setItem('auth_token', res.data.data.accessToken);
    localStorage.setItem('auth_refresh_token', res.data.data.refreshToken);
    return res.data.data.accessToken;
  },

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.RESEND_VERIFICATION);
    return res.data;
  },

  /**
   * GET /api/auth/verify-email?token=xxx
   * Backend reads from req.query not req.params
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const res = await axiosInstance.get(API_ENDPOINTS.VERIFY_EMAIL, { params: { token } });
    return res.data;
  },
};