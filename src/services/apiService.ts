import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '../types';
import { APP_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from '../constants';
import { storageService } from './storageService';

export class ApiService {
  private api: AxiosInstance;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: APP_CONFIG.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await this.clearAuthData();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.tokenRefreshPromise;
      this.tokenRefreshPromise = null;
      return newToken;
    } catch (error) {
      this.tokenRefreshPromise = null;
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await storageService.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      if (response.data.success && response.data.data.token) {
        const newToken = response.data.data.token;
        await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        return newToken;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      await this.clearAuthData();
      throw error;
    }
  }

  private async clearAuthData(): Promise<void> {
    await storageService.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url);
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  private handleError<T>(error: AxiosError): ApiResponse<T> {
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as any;
      return {
        success: false,
        error: responseData?.error || responseData?.message || ERROR_MESSAGES.SERVER_ERROR,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message || ERROR_MESSAGES.SERVER_ERROR,
      };
    }
  }

  // Utility methods
  setBaseURL(baseURL: string): void {
    this.api.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.api.defaults.timeout = timeout;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.api.defaults.headers, headers);
  }

  removeDefaultHeader(headerName: string): void {
    delete this.api.defaults.headers[headerName];
  }
}

export const apiService = new ApiService();
