import { ApiResponse, User } from '../types';
import { API_ENDPOINTS } from '../constants';
import { apiService } from './apiService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface TokenValidationResponse {
  user: User;
  isValid: boolean;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  async logout(): Promise<ApiResponse<any>> {
    return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  }

  async validateToken(token: string): Promise<ApiResponse<TokenValidationResponse>> {
    return apiService.get<TokenValidationResponse>('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(data: { token: string; password: string }): Promise<ApiResponse<any>> {
    return apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    return apiService.post('/auth/change-password', data);
  }

  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    return apiService.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<any>> {
    return apiService.post('/auth/resend-verification');
  }

  // OAuth methods (for future implementation)
  async loginWithGoogle(token: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/google', { token });
  }

  async loginWithFacebook(token: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/facebook', { token });
  }

  async loginWithApple(token: string): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/apple', { token });
  }

  // Biometric authentication (for future implementation)
  async enableBiometric(): Promise<ApiResponse<any>> {
    return apiService.post('/auth/enable-biometric');
  }

  async disableBiometric(): Promise<ApiResponse<any>> {
    return apiService.post('/auth/disable-biometric');
  }

  async authenticateWithBiometric(): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/biometric');
  }
}

export const authService = new AuthService();
