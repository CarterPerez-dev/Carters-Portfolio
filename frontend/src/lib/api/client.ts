// ===========================
// API Configuration
// ©AngelaMos | 2025
// ===========================

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { useAuthStore } from '@/lib/store/auth.store';
import { ERROR_MESSAGES } from '@/constants';

const API_BASE_URL = '/api/v1';
const API_TIMEOUT = 30000;

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type ApiRequestConfig = AxiosRequestConfig;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (
      accessToken !== null &&
      accessToken !== undefined &&
      config.headers !== undefined
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (error instanceof AxiosError) {
      const originalRequest = error.config as
        | ExtendedAxiosRequestConfig
        | undefined;

      if (
        error.response?.status === 401 &&
        originalRequest !== null &&
        originalRequest !== undefined &&
        originalRequest._retry !== true
      ) {
        originalRequest._retry = true;

        try {
          const { refreshToken } = useAuthStore.getState();
          if (refreshToken === null || refreshToken === undefined) {
            throw new Error(ERROR_MESSAGES.NO_REFRESH_TOKEN);
          }

          const response = await axios.post<{ access_token: string }>(
            `${API_BASE_URL}${API_ENDPOINTS.admin.refresh}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
              withCredentials: true,
              timeout: API_TIMEOUT,
            },
          );

          const { access_token } = response.data;

          const { admin } = useAuthStore.getState();
          if (admin !== null && admin !== undefined) {
            useAuthStore
              .getState()
              .setAuth(admin, access_token, refreshToken);
          }

          if (originalRequest.headers !== undefined) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return await apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          window.location.href = '/admin/login';
          return Promise.reject(
            refreshError instanceof Error
              ? refreshError
              : new Error(String(refreshError)),
          );
        }
      }
    }

    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

export const api = {
  get: <T>(url: string, config?: ApiRequestConfig): Promise<T> =>
    apiClient
      .get<T>(url, config as ExtendedAxiosRequestConfig)
      .then((res) => res.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> =>
    apiClient
      .post<T>(url, data, config as ExtendedAxiosRequestConfig)
      .then((res) => res.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> =>
    apiClient
      .put<T>(url, data, config as ExtendedAxiosRequestConfig)
      .then((res) => res.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> =>
    apiClient
      .patch<T>(url, data, config as ExtendedAxiosRequestConfig)
      .then((res) => res.data),

  delete: <T>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig,
  ): Promise<T> =>
    apiClient
      .delete<T>(url, { ...config, data } as ExtendedAxiosRequestConfig)
      .then((res) => res.data),
};

export { apiClient };
