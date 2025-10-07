// ===========================
// Admin Auth Hooks
// ©AngelaMos | 2025
// ===========================

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { api, API_ENDPOINTS } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  github_username: string | null;
  github_avatar_url: string | null;
  is_active: boolean;
}

interface PasswordLoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  admin: AdminUser;
}

const isLoginResponse = (data: unknown): data is LoginResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.access_token === 'string' &&
    typeof obj.refresh_token === 'string' &&
    typeof obj.token_type === 'string' &&
    typeof obj.expires_in === 'number' &&
    obj.admin !== null &&
    obj.admin !== undefined &&
    typeof obj.admin === 'object'
  );
};

export const usePasswordLogin = (): UseMutationResult<
  LoginResponse,
  unknown,
  PasswordLoginRequest
> => {
  const { setAuth } = useAuthStore();

  return useMutation<LoginResponse, unknown, PasswordLoginRequest>({
    mutationFn: async (
      credentials: PasswordLoginRequest,
    ): Promise<LoginResponse> => {
      return await api.post<LoginResponse>(
        API_ENDPOINTS.admin.login,
        credentials,
      );
    },
    onSuccess: (data: unknown) => {
      if (isLoginResponse(data)) {
        setAuth(data.admin, data.access_token, data.refresh_token);
      } else {
        toast.error('Invalid response from server');
      }
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData: unknown = error.response.data;

        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
          const apiError = errorData as { message: unknown };
          if (typeof apiError.message === 'string') {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';
      toast.error(errorMessage);
    },
  });
};

export const useGitHubOAuth = (): (() => void) => {
  return () => {
    const baseUrl = window.location.origin;
    const githubAuthUrl = `${baseUrl}/api/v1${API_ENDPOINTS.admin.githubAuth}`;
    window.location.href = githubAuthUrl;
  };
};
