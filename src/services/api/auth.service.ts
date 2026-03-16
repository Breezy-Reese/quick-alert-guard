import axiosInstance from "@/config/axios.config";
import { TOKEN_KEYS } from "@/config/axios.config";
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
   HELPERS
============================================================ */

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEYS.access, accessToken);
  localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
};

/* ============================================================
   SERVICE
============================================================ */

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const res = await axiosInstance.post<AuthApiResponse>(API_ENDPOINTS.REGISTER, payload);
    saveTokens(res.data.data.accessToken, res.data.data.refreshToken);
    return res.data.data.user;
  },

  async login(payload: LoginPayload): Promise<User> {
    const res = await axiosInstance.post<AuthApiResponse>(API_ENDPOINTS.LOGIN, payload);
    saveTokens(res.data.data.accessToken, res.data.data.refreshToken);
    return res.data.data.user;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    } finally {
      clearTokens();
    }
  },

  async getMe(): Promise<User> {
    const res = await axiosInstance.get<ProfileApiResponse>(API_ENDPOINTS.ME);
    return res.data.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, payload);
    return res.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, payload);
    return res.data;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh);
    if (!refreshToken) throw new Error('No refresh token');
    const res = await axiosInstance.post<AuthApiResponse>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
    saveTokens(res.data.data.accessToken, res.data.data.refreshToken);
    return res.data.data.accessToken;
  },

  async resendVerification(): Promise<{ message: string }> {
    const res = await axiosInstance.post(API_ENDPOINTS.RESEND_VERIFICATION);
    return res.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const res = await axiosInstance.get(API_ENDPOINTS.VERIFY_EMAIL, { params: { token } });
    return res.data;
  },
};