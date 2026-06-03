import apiClient, { setTokens, clearTokens, handleApiError } from '@/lib/api-client';
import type {
  LoginRequest,
  RegisterRequest,
  AccessTokenResponse,
  InfoResponse,
  InfoRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendConfirmationEmailRequest,
} from '@/types';

// Login
export const login = async (credentials: LoginRequest): Promise<AccessTokenResponse> => {
  try {
    const response = await apiClient.post<AccessTokenResponse>('/login', credentials);
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Register
export const register = async (data: RegisterRequest): Promise<AccessTokenResponse> => {
  try {
    const response = await apiClient.post<AccessTokenResponse>('/register', data);
    
    // API returns 200 OK with empty body for successful registration
    // No tokens are returned - user needs to login after registration
    if (response.data && response.data.accessToken && response.data.refreshToken) {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      return response.data;
    }
    
    // Return empty object if no tokens (successful registration, need to login)
    return {} as AccessTokenResponse;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/logout');
  } catch (error) {
    console.error('Logout error:', handleApiError(error));
  } finally {
    clearTokens();
  }
};

// Refresh Token
export const refreshToken = async (refreshToken: string): Promise<AccessTokenResponse> => {
  try {
    const response = await apiClient.post<AccessTokenResponse>('/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setTokens(accessToken, newRefreshToken);
    return response.data;
  } catch (error) {
    clearTokens();
    throw new Error(handleApiError(error));
  }
};

// Get Account Info
export const getAccountInfo = async (): Promise<InfoResponse> => {
  try {
    const response = await apiClient.get<InfoResponse>('/manage/info');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update Account Info
export const updateAccountInfo = async (data: InfoRequest): Promise<InfoResponse> => {
  try {
    const response = await apiClient.post<InfoResponse>('/manage/info', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Confirm Email
export const confirmEmail = async (userId: string, code: string, changedEmail?: string): Promise<void> => {
  try {
    const params: any = { userId, code };
    if (changedEmail) params.changedEmail = changedEmail;
    await apiClient.get('/confirmEmail', { params });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Resend Confirmation Email
export const resendConfirmationEmail = async (email: string): Promise<void> => {
  try {
    await apiClient.post('/resendConfirmationEmail', { email } as ResendConfirmationEmailRequest);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Forgot Password
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiClient.post('/forgotPassword', { email } as ForgotPasswordRequest);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Reset Password
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  try {
    await apiClient.post('/resetPassword', data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  login,
  register,
  logout,
  refreshToken,
  getAccountInfo,
  updateAccountInfo,
  confirmEmail,
  resendConfirmationEmail,
  forgotPassword,
  resetPassword,
};