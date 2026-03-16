import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/api/auth.service';
import { TOKEN_KEYS } from '@/config/axios.config';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    role: string,
    phone?: string,
    hospitalName?: string,
    licenseNumber?: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // On mount — restore session if access token exists
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.access);
    if (token) {
      authService
        .getMe()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem(TOKEN_KEYS.access);
          localStorage.removeItem(TOKEN_KEYS.refresh);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await authService.login({ email, password });
      setUser(u);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    setError(null);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, error, clearError, login, register, logout }}
    >
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
