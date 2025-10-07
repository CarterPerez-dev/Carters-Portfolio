// ===========================
// Project API Hooks
// ©AngelaMos | 2025
// ===========================

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { api, API_ENDPOINTS } from '@/lib/api';
import { PROJECT_MESSAGES } from '@/constants';
import type {
  ProjectUpdateRequest,
  ProjectSearchRequest,
  ProjectResponse,
  ProjectListResponse,
  ProjectUpdateResponse,
  ProjectVisibilityResponse,
  ProjectFeaturedResponse,
  ProjectStatsResponse,
  GitHubSyncResponse,
  GitHubSyncSingleResponse,
  GitHubRateLimitResponse,
} from '@/lib/types/api/projects';
import {
  isValidProjectResponse,
  isValidProjectListResponse,
  isValidProjectUpdateResponse,
  isValidProjectVisibilityResponse,
  isValidProjectFeaturedResponse,
  isValidProjectStatsResponse,
  isValidGitHubSyncResponse,
  isValidGitHubSyncSingleResponse,
  isValidGitHubRateLimitResponse,
} from '@/lib/types/guards/projects.guards';

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (limit?: number, featuredOnly?: boolean) =>
    [...projectQueryKeys.lists(), { limit, featuredOnly }] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
  byGitHubId: (githubId: number) =>
    [...projectQueryKeys.all, 'github', githubId] as const,
  stats: () => [...projectQueryKeys.all, 'stats'] as const,
  search: (query?: string, language?: string, projectType?: string) =>
    [
      ...projectQueryKeys.all,
      'search',
      { query, language, projectType },
    ] as const,
  rateLimit: () => [...projectQueryKeys.all, 'rateLimit'] as const,
};

export const projectQueries = {
  getProjects: async (
    limit?: number,
    featuredOnly?: boolean,
  ): Promise<ProjectListResponse> => {
    const params = {
      limit: limit ?? 12,
      featured_only: featuredOnly ?? false,
    };
    return api.get<ProjectListResponse>(API_ENDPOINTS.projects.list, {
      params,
    });
  },

  getProject: async (id: string): Promise<ProjectResponse> => {
    return api.get<ProjectResponse>(API_ENDPOINTS.projects.get(id));
  },

  getProjectByGitHubId: async (
    githubId: number,
  ): Promise<ProjectResponse> => {
    return api.get<ProjectResponse>(
      API_ENDPOINTS.projects.getByGitHubId(githubId),
    );
  },

  getProjectStats: async (): Promise<ProjectStatsResponse> => {
    return api.get<ProjectStatsResponse>(API_ENDPOINTS.projects.stats);
  },

  searchProjects: async (
    data: ProjectSearchRequest,
  ): Promise<ProjectListResponse> => {
    return api.post<ProjectListResponse>(
      API_ENDPOINTS.projects.search,
      data,
    );
  },

  getGitHubRateLimit: async (): Promise<GitHubRateLimitResponse> => {
    return api.get<GitHubRateLimitResponse>(
      API_ENDPOINTS.projects.rateLimit,
    );
  },
};

export const projectMutations = {
  updateProject: async (
    id: string,
    data: ProjectUpdateRequest,
  ): Promise<ProjectUpdateResponse> => {
    return api.put<ProjectUpdateResponse>(
      API_ENDPOINTS.projects.update(id),
      data,
    );
  },

  toggleProjectVisibility: async (
    id: string,
  ): Promise<ProjectVisibilityResponse> => {
    return api.post<ProjectVisibilityResponse>(
      API_ENDPOINTS.projects.toggleVisibility(id),
      {},
    );
  },

  toggleProjectFeatured: async (
    id: string,
  ): Promise<ProjectFeaturedResponse> => {
    return api.post<ProjectFeaturedResponse>(
      API_ENDPOINTS.projects.toggleFeatured(id),
      {},
    );
  },

  syncAllProjects: async (): Promise<GitHubSyncResponse> => {
    return api.post<GitHubSyncResponse>(API_ENDPOINTS.projects.sync.all, {});
  },

  syncSingleProject: async (
    repoName: string,
  ): Promise<GitHubSyncSingleResponse> => {
    return api.post<GitHubSyncSingleResponse>(
      API_ENDPOINTS.projects.sync.single(repoName),
      {},
    );
  },
};

export const useProjects = (
  limit?: number,
  featuredOnly?: boolean,
): UseQueryResult<ProjectListResponse, unknown> => {
  return useQuery({
    queryKey: projectQueryKeys.list(limit, featuredOnly),
    queryFn: async (): Promise<ProjectListResponse> => {
      const response = await projectQueries.getProjects(limit, featuredOnly);

      if (isValidProjectListResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProject = (
  id: string,
): UseQueryResult<ProjectResponse, unknown> => {
  return useQuery({
    queryKey: projectQueryKeys.detail(id),
    queryFn: async (): Promise<ProjectResponse> => {
      const response = await projectQueries.getProject(id);

      if (isValidProjectResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_PROJECT_RESPONSE);
    },
    enabled: id !== undefined && id !== null && id.length > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useProjectByGitHubId = (
  githubId: number,
): UseQueryResult<ProjectResponse, unknown> => {
  return useQuery({
    queryKey: projectQueryKeys.byGitHubId(githubId),
    queryFn: async (): Promise<ProjectResponse> => {
      const response = await projectQueries.getProjectByGitHubId(githubId);

      if (isValidProjectResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_PROJECT_RESPONSE);
    },
    enabled: githubId !== undefined && githubId !== null && githubId > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useProjectStats = (): UseQueryResult<
  ProjectStatsResponse,
  unknown
> => {
  return useQuery({
    queryKey: projectQueryKeys.stats(),
    queryFn: async (): Promise<ProjectStatsResponse> => {
      const response = await projectQueries.getProjectStats();

      if (isValidProjectStatsResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_STATS_RESPONSE);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGitHubRateLimit = (): UseQueryResult<
  GitHubRateLimitResponse,
  unknown
> => {
  return useQuery({
    queryKey: projectQueryKeys.rateLimit(),
    queryFn: async (): Promise<GitHubRateLimitResponse> => {
      const response = await projectQueries.getGitHubRateLimit();

      if (isValidGitHubRateLimitResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_PROJECT_RESPONSE);
    },
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  });
};

export const useSearchProjects = (): UseMutationResult<
  ProjectListResponse,
  unknown,
  ProjectSearchRequest
> => {
  return useMutation<ProjectListResponse, unknown, ProjectSearchRequest>({
    mutationFn: async (
      data: ProjectSearchRequest,
    ): Promise<ProjectListResponse> => {
      const response = await projectQueries.searchProjects(data);

      if (isValidProjectListResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    onError: (error: unknown): void => {
      if (
        error instanceof AxiosError &&
        error.response?.data !== null &&
        error.response?.data !== undefined
      ) {
        const errorData: unknown = error.response.data;

        if (
          errorData !== null &&
          errorData !== undefined &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : PROJECT_MESSAGES.ERROR.SEARCH_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useUpdateProject = (): UseMutationResult<
  ProjectUpdateResponse,
  unknown,
  { id: string; data: ProjectUpdateRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    ProjectUpdateResponse,
    unknown,
    { id: string; data: ProjectUpdateRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ProjectUpdateResponse> => {
      const response = await projectMutations.updateProject(id, data);

      if (isValidProjectUpdateResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_UPDATE_RESPONSE);
    },
    onSuccess: (data: unknown, variables) => {
      if (isValidProjectUpdateResponse(data)) {
        toast.success(PROJECT_MESSAGES.SUCCESS.UPDATED);

        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.detail(variables.id),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.lists(),
        });
      } else {
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_UPDATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (
        error instanceof AxiosError &&
        error.response?.data !== null &&
        error.response?.data !== undefined
      ) {
        const errorData: unknown = error.response.data;

        if (
          errorData !== null &&
          errorData !== undefined &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : PROJECT_MESSAGES.ERROR.UPDATE_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useToggleProjectVisibility = (): UseMutationResult<
  ProjectVisibilityResponse,
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<ProjectVisibilityResponse, unknown, string>({
    mutationFn: async (id: string): Promise<ProjectVisibilityResponse> => {
      const response = await projectMutations.toggleProjectVisibility(id);

      if (isValidProjectVisibilityResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_UPDATE_RESPONSE);
    },
    onSuccess: (data: unknown, id) => {
      if (isValidProjectVisibilityResponse(data)) {
        toast.success(PROJECT_MESSAGES.SUCCESS.VISIBILITY_TOGGLED);

        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.detail(id),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.stats(),
        });
      } else {
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_UPDATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (
        error instanceof AxiosError &&
        error.response?.data !== null &&
        error.response?.data !== undefined
      ) {
        const errorData: unknown = error.response.data;

        if (
          errorData !== null &&
          errorData !== undefined &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : PROJECT_MESSAGES.ERROR.VISIBILITY_TOGGLE_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useToggleProjectFeatured = (): UseMutationResult<
  ProjectFeaturedResponse,
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<ProjectFeaturedResponse, unknown, string>({
    mutationFn: async (id: string): Promise<ProjectFeaturedResponse> => {
      const response = await projectMutations.toggleProjectFeatured(id);

      if (isValidProjectFeaturedResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_UPDATE_RESPONSE);
    },
    onSuccess: (data: unknown, id) => {
      if (isValidProjectFeaturedResponse(data)) {
        toast.success(PROJECT_MESSAGES.SUCCESS.FEATURED_TOGGLED);

        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.detail(id),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.stats(),
        });
      } else {
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_UPDATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (
        error instanceof AxiosError &&
        error.response?.data !== null &&
        error.response?.data !== undefined
      ) {
        const errorData: unknown = error.response.data;

        if (
          errorData !== null &&
          errorData !== undefined &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : PROJECT_MESSAGES.ERROR.FEATURED_TOGGLE_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useSyncAllProjects = (): UseMutationResult<
  GitHubSyncResponse,
  unknown,
  undefined
> => {
  const queryClient = useQueryClient();

  return useMutation<GitHubSyncResponse, unknown, undefined>({
    mutationFn: async (_variables: undefined): Promise<GitHubSyncResponse> => {
      const response = await projectMutations.syncAllProjects();

      if (isValidGitHubSyncResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_SYNC_RESPONSE);
    },
    onSuccess: (data: unknown) => {
      if (isValidGitHubSyncResponse(data)) {
        toast.success(
          `${PROJECT_MESSAGES.SUCCESS.SYNCED_ALL} (${data.synced.toString()} synced, ${data.created.toString()} new)`,
        );

        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.all,
        });
        void queryClient.invalidateQueries({
          queryKey: projectQueryKeys.stats(),
        });
      } else {
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_SYNC_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (
        error instanceof AxiosError &&
        error.response?.data !== null &&
        error.response?.data !== undefined
      ) {
        const errorData: unknown = error.response.data;

        if (
          errorData !== null &&
          errorData !== undefined &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : PROJECT_MESSAGES.ERROR.SYNC_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useSyncSingleProject = (): UseMutationResult<
  GitHubSyncSingleResponse,
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<GitHubSyncSingleResponse, unknown, string>({
    mutationFn: async (
      repoName: string,
    ): Promise<GitHubSyncSingleResponse> => {
      const response = await projectMutations.syncSingleProject(repoName);

      if (isValidGitHubSyncSingleResponse(response)) {
        return response;
      }

      throw new Error(PROJECT_MESSAGES.ERROR.INVALID_SYNC_RESPONSE);
    },
    onSuccess: (data: unknown) => {
      if (isValidGitHubSyncSingleResponse(data)) {
        if (data.success) {
          toast.success(PROJECT_MESSAGES.SUCCESS.SYNCED_SINGLE);

          if (data.project_id !== undefined) {
            void queryClient.invalidateQueries({
              queryKey: projectQueryKeys.detail(data.project_id),
            });
          }
          void queryClient.invalidateQueries({
            queryKey: projectQueryKeys.lists(),
          });
          void queryClient.invalidateQueries({
            queryKey: projectQueryKeys.stats(),
          });
        } else {
          toast.error(data.error ?? PROJECT_MESSAGES.ERROR.SYNC_FAILED);
        }
      } else {
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_SYNC_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (
        error instanceof AxiosError &&
        error.response?.data !== null &&
        error.response?.data !== undefined
      ) {
        const errorData: unknown = error.response.data;

        if (
          errorData !== null &&
          errorData !== undefined &&
          typeof errorData === 'object' &&
          'message' in errorData
        ) {
          const apiError = errorData as { message: unknown };
          if (
            typeof apiError.message === 'string' &&
            apiError.message.length > 0
          ) {
            toast.error(apiError.message);
            return;
          }
        }
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : PROJECT_MESSAGES.ERROR.SYNC_FAILED;
      toast.error(fallbackMessage);
    },
  });
};
