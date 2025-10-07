// ===========================
// GitHub OAuth Callback
// ©AngelaMos | 2025
// ===========================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import { api, API_ENDPOINTS } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface GitHubCallbackResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  admin: {
    id: string;
    email: string;
    name: string | null;
    github_username: string | null;
    github_avatar_url: string | null;
    is_active: boolean;
  };
}

const isGitHubCallbackResponse = (
  data: unknown,
): data is GitHubCallbackResponse => {
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

export const GitHubCallback = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        const response = await api.get<GitHubCallbackResponse>(
          API_ENDPOINTS.admin.githubTokens,
        );

        if (isGitHubCallbackResponse(response)) {
          setAuth(response.admin, response.access_token, response.refresh_token);
          toast.success('✓ GitHub authentication successful');
          void navigate('/root', { state: { githubAuthSuccess: true } });
        } else {
          toast.error('Invalid response from server');
          void navigate('/root');
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
          const errorData: unknown = error.response.data;

          if (
            errorData !== null &&
            errorData !== undefined &&
            typeof errorData === 'object' &&
            'message' in errorData
          ) {
            const apiError = errorData as { message: unknown };
            if (typeof apiError.message === 'string') {
              toast.error(apiError.message);
              void navigate('/root');
              return;
            }
          }
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'GitHub authentication failed';
        toast.error(errorMessage);
        void navigate('/root');
      }
    };

    void handleCallback();
  }, [navigate, setAuth]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'monospace',
      }}
    >
      <div>⟳ Authenticating with GitHub...</div>
    </div>
  );
};
