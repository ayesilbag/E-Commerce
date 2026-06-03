import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { login as loginService, refreshToken as refreshTokenService } from '@/services/auth.service';
import { getUserProfile } from '@/services/users.service';
import { setTokens, clearTokens } from '@/lib/api-client';
import type { User } from '@/types';

export type { User };

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  getUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refresh_token') || null);

  // Restore user session on app load if tokens exist
  useEffect(() => {
    const restoreSession = async () => {
      if (accessToken && refreshToken && !user) {
        try {
          setIsLoading(true);
          const userInfo = await getUserProfile();
          setUser(userInfo);
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Tokenlar geçersiz, temizle
          logout();
        } finally {
          setIsLoading(false);
        }
      }
    };
    restoreSession();
  }, []);

  // Sync in-memory token store whenever tokens change
  useEffect(() => {
    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
    } else {
      clearTokens();
    }
  }, [accessToken, refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginService({ email, password });

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      try {
        const userInfo = await getUserProfile();
        setUser(userInfo);
      } catch {
        setUser({ id: '', email, fullName: '', phone: '', role: 'customer', isActive: true, isEmailVerified: false, createdAt: '', updatedAt: '' });
      }

      toast.success('Giriş başarılı', {
        description: `${email} olarak giriş yaptınız`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Giriş başarısız';
      toast.error('Giriş hatası', { description: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await refreshTokenService(refreshToken);

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      const userInfo = await getUserProfile();
      setUser(userInfo);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!accessToken,
    isLoading,
    accessToken,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
    getUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
