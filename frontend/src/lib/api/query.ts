// ===========================
// TanStack Query Configuration
// ©AngelaMos | 2025
// ===========================

import { toast } from 'sonner';
import { AxiosError } from 'axios';
import {
  QueryClient,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { isBackendErrorResponse } from './guards';

const createQueryCache = (): QueryCache => {
  return new QueryCache({
    onError: (error: unknown, query) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return;
      }

      if (query.options.meta?.skipGlobalErrorHandler === true) {
        return;
      }

      console.error(
        `Query error for ${JSON.stringify(query.queryKey)}:`,
        error,
      );

      let message = 'An unexpected error occurred';

      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;
        if (isBackendErrorResponse(errorData)) {
          message = errorData.error;
        } else if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'message' in errorData
        ) {
          const msgObj = errorData as { message: unknown };
          if (typeof msgObj.message === 'string') {
            message = msgObj.message;
          }
        } else {
          message = 'Request failed';
        }
      }

      toast.error(message);
    },
  });
};

const createMutationCache = (): MutationCache => {
  return new MutationCache({
    onError: (error: unknown, _variables, _context, mutation) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return;
      }

      if (mutation.options.meta?.skipGlobalErrorHandler === true) {
        return;
      }

      const mutationKey = mutation.options.mutationKey;
      if (mutationKey !== null && mutationKey !== undefined) {
        console.error(
          `Mutation error for ${JSON.stringify(mutationKey)}:`,
          error,
        );
      }

      let message = 'An unexpected error occurred';

      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;
        if (isBackendErrorResponse(errorData)) {
          message = errorData.error;
        } else if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'message' in errorData
        ) {
          const msgObj = errorData as { message: unknown };
          if (typeof msgObj.message === 'string') {
            message = msgObj.message;
          }
        } else {
          message = 'Operation failed';
        }
      }

      toast.error(message);
    },
  });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,

      retry: (failureCount: number, error: unknown): boolean => {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status !== undefined && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },

      retryDelay: (attemptIndex: number): number => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },

      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: true,
    },

    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },

  queryCache: createQueryCache(),
  mutationCache: createMutationCache(),
});

export const queryKeys = {
  all: ['portfolio'] as const,

  admin: {
    all: () => [...queryKeys.all, 'admin'] as const,
    status: () => [...queryKeys.admin.all(), 'status'] as const,
  },

  projects: {
    all: () => [...queryKeys.all, 'projects'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.projects.all(), 'list', params] as const,
    detail: (id: string) =>
      [...queryKeys.projects.all(), 'detail', id] as const,
    stats: () => [...queryKeys.projects.all(), 'stats'] as const,
  },

  blogs: {
    all: () => [...queryKeys.all, 'blogs'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.blogs.all(), 'list', params] as const,
    detail: (slug: string) =>
      [...queryKeys.blogs.all(), 'detail', slug] as const,
  },

  contact: {
    all: () => [...queryKeys.all, 'contact'] as const,
    list: () => [...queryKeys.contact.all(), 'list'] as const,
  },
} as const;
