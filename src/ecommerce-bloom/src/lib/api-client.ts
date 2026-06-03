import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Base Configuration - Use relative URL for proxy support in development
// Production uses the backend URL directly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://test-bayi.digitalep.net');
const API_TIMEOUT = 10000;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token store with localStorage persistence
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

let _accessToken: string | null = localStorage.getItem(TOKEN_KEY) || null;
let _refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY) || null;

// Called exclusively by AuthContext to keep the store in sync with React state
export const setTokens = (accessToken: string, refreshToken: string): void => {
  _accessToken = accessToken;
  _refreshToken = refreshToken;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  _accessToken = null;
  _refreshToken = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getToken = (): string | null => _accessToken;

export const getRefreshToken = (): string | null => _refreshToken;

// Request Interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If 401 error and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        setTokens(newAccessToken, newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear in-memory tokens and redirect to login
        clearTokens();

        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as { detail?: string; title?: string; message?: string };
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      return data.detail || data.title || data.message || `Sunucu hatası: ${error.response.status}`;
    } else if (error.request) {
      // Request made but no response received
      console.error('API Error - No Response:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        message: error.message
      });
      return `Sunucuya bağlanılamadı (${error.config?.baseURL}${error.config?.url}). Lütfen sunucunun çalıştığından ve CORS ayarlarının doğru olduğundan emin olun.`;
    } else {
      // Request setup error
      console.error('API Error - Request Setup:', error.message);
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Beklenmeyen bir hata oluştu';
};

export default apiClient;