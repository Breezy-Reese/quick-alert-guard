import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/api/auth.service';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  register: (email: string, password: string, name: string, role: string, phone?: string, hospitalName?: string, licenseNumber?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService
        .getMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('auth_user');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const u = await authService.login({ email, password });
      setUser(u);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Login failed';
      setError(msg);
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string,
    phone?: string,
    hospitalName?: string,
    licenseNumber?: string,
  ) => {
    try {
      setError(null);
      const u = await authService.register({
        email,
        password,
        name,
        role: role as 'driver' | 'hospital' | 'responder',
        phone: phone || '',
        hospitalName,
        licenseNumber,
      });
      setUser(u);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Registration failed';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, clearError, login, register, logout }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
