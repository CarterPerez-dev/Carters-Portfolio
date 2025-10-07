// ===========================
// Admin Auth Store
// ©AngelaMos | 2025
// ===========================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { api, API_ENDPOINTS } from '@/lib/api';
import { STORAGE_KEYS } from '@/constants';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  github_username: string | null;
  github_avatar_url: string | null;
  is_active: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setAuth: (
    admin: AdminUser,
    accessToken: string,
    refreshToken: string,
  ) => void;
  clearAuth: () => void;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (admin, accessToken, refreshToken) => {
        set({
          isAuthenticated: true,
          admin,
          accessToken,
          refreshToken,
        });
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          admin: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      checkAuthStatus: async () => {
        try {
          const { accessToken } = useAuthStore.getState();
          if (accessToken === null || accessToken === undefined) {
            set({ isAuthenticated: false, admin: null });
            return;
          }

          const response = await api.get<{
            authenticated: boolean;
            admin?: AdminUser;
          }>(API_ENDPOINTS.admin.status);

          if (
            response.authenticated &&
            response.admin !== null &&
            response.admin !== undefined
          ) {
            set({
              isAuthenticated: true,
              admin: response.admin,
            });
          } else {
            set({ isAuthenticated: false, admin: null });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ isAuthenticated: false, admin: null });
        }
      },

      logout: async () => {
        try {
          await api.post(API_ENDPOINTS.admin.logout);
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            admin: null,
            accessToken: null,
            refreshToken: null,
          });
        }
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
