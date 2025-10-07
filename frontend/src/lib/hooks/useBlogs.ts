// ===========================
// Blog API Hooks
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
import { BLOG_MESSAGES } from '@/constants';
import type {
  BlogCreateRequest,
  BlogUpdateRequest,
  BlogSearchRequest,
  BlogResponse,
  BlogListResponse,
  BlogCreateResponse,
  BlogDeleteResponse,
} from '@/lib/types/api/blogs';
import {
  isValidBlogResponse,
  isValidBlogListResponse,
  isValidBlogCreateResponse,
  isValidBlogDeleteResponse,
} from '@/lib/types/guards/blogs.guards';

export const blogQueryKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogQueryKeys.all, 'list'] as const,
  list: (limit?: number, offset?: number) =>
    [...blogQueryKeys.lists(), { limit, offset }] as const,
  allBlogs: () => [...blogQueryKeys.all, 'all'] as const,
  details: () => [...blogQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogQueryKeys.details(), id] as const,
  bySlug: (slug: string) => [...blogQueryKeys.all, 'slug', slug] as const,
  byTag: (tag: string) => [...blogQueryKeys.all, 'tag', tag] as const,
  search: (query: string, tag?: string) =>
    [...blogQueryKeys.all, 'search', { query, tag }] as const,
};

export const blogQueries = {
  getPublishedBlogs: async (
    limit?: number,
    offset?: number,
  ): Promise<BlogListResponse> => {
    const params = {
      limit: limit ?? 10,
      offset: offset ?? 0,
    };
    return api.get<BlogListResponse>(API_ENDPOINTS.blogs.list, { params });
  },

  getAllBlogs: async (
    limit?: number,
    offset?: number,
  ): Promise<BlogListResponse> => {
    const params = {
      limit: limit ?? 10,
      offset: offset ?? 0,
    };
    return api.get<BlogListResponse>(API_ENDPOINTS.blogs.all, { params });
  },

  getBlogBySlug: async (slug: string): Promise<BlogResponse> => {
    return api.get<BlogResponse>(API_ENDPOINTS.blogs.getBySlug(slug));
  },

  getBlogById: async (id: string): Promise<BlogResponse> => {
    return api.get<BlogResponse>(API_ENDPOINTS.blogs.get(id));
  },

  getBlogsByTag: async (
    tag: string,
    limit?: number,
  ): Promise<BlogListResponse> => {
    const params = limit !== undefined ? { limit } : undefined;
    return api.get<BlogListResponse>(API_ENDPOINTS.blogs.byTag(tag), {
      params,
    });
  },

  searchBlogs: async (
    data: BlogSearchRequest,
  ): Promise<BlogListResponse> => {
    return api.post<BlogListResponse>(API_ENDPOINTS.blogs.search, data);
  },
};

export const blogMutations = {
  createBlog: async (
    data: BlogCreateRequest,
  ): Promise<BlogCreateResponse> => {
    return api.post<BlogCreateResponse>(API_ENDPOINTS.blogs.create, data);
  },

  updateBlog: async (
    id: string,
    data: BlogUpdateRequest,
  ): Promise<BlogCreateResponse> => {
    return api.put<BlogCreateResponse>(API_ENDPOINTS.blogs.update(id), data);
  },

  deleteBlog: async (id: string): Promise<BlogDeleteResponse> => {
    return api.delete<BlogDeleteResponse>(API_ENDPOINTS.blogs.delete(id));
  },

  publishBlog: async (id: string): Promise<BlogCreateResponse> => {
    return api.post<BlogCreateResponse>(API_ENDPOINTS.blogs.publish(id), {});
  },

  unpublishBlog: async (id: string): Promise<BlogCreateResponse> => {
    return api.post<BlogCreateResponse>(
      API_ENDPOINTS.blogs.unpublish(id),
      {},
    );
  },
};

export const usePublishedBlogs = (
  limit?: number,
  offset?: number,
): UseQueryResult<BlogListResponse, unknown> => {
  return useQuery({
    queryKey: blogQueryKeys.list(limit, offset),
    queryFn: async (): Promise<BlogListResponse> => {
      const response = await blogQueries.getPublishedBlogs(limit, offset);

      if (isValidBlogListResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAllBlogs = (
  limit?: number,
  offset?: number,
): UseQueryResult<BlogListResponse, unknown> => {
  return useQuery({
    queryKey: blogQueryKeys.allBlogs(),
    queryFn: async (): Promise<BlogListResponse> => {
      const response = await blogQueries.getAllBlogs(limit, offset);

      if (isValidBlogListResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBlogBySlug = (
  slug: string,
): UseQueryResult<BlogResponse, unknown> => {
  return useQuery({
    queryKey: blogQueryKeys.bySlug(slug),
    queryFn: async (): Promise<BlogResponse> => {
      const response = await blogQueries.getBlogBySlug(slug);

      if (isValidBlogResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_BLOG_RESPONSE);
    },
    enabled: slug !== undefined && slug !== null && slug.length > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useBlogById = (
  id: string,
): UseQueryResult<BlogResponse, unknown> => {
  return useQuery({
    queryKey: blogQueryKeys.detail(id),
    queryFn: async (): Promise<BlogResponse> => {
      const response = await blogQueries.getBlogById(id);

      if (isValidBlogResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_BLOG_RESPONSE);
    },
    enabled: id !== undefined && id !== null && id.length > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

export const useBlogsByTag = (
  tag: string,
  limit?: number,
): UseQueryResult<BlogListResponse, unknown> => {
  return useQuery({
    queryKey: blogQueryKeys.byTag(tag),
    queryFn: async (): Promise<BlogListResponse> => {
      const response = await blogQueries.getBlogsByTag(tag, limit);

      if (isValidBlogListResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    enabled: tag !== undefined && tag !== null && tag.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSearchBlogs = (): UseMutationResult<
  BlogListResponse,
  unknown,
  BlogSearchRequest
> => {
  return useMutation<BlogListResponse, unknown, BlogSearchRequest>({
    mutationFn: async (
      data: BlogSearchRequest,
    ): Promise<BlogListResponse> => {
      const response = await blogQueries.searchBlogs(data);

      if (isValidBlogListResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_LIST_RESPONSE);
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (
          errorData &&
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
          : BLOG_MESSAGES.ERROR.SEARCH_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useCreateBlog = (): UseMutationResult<
  BlogCreateResponse,
  unknown,
  BlogCreateRequest
> => {
  const queryClient = useQueryClient();

  return useMutation<BlogCreateResponse, unknown, BlogCreateRequest>({
    mutationFn: async (
      data: BlogCreateRequest,
    ): Promise<BlogCreateResponse> => {
      const response = await blogMutations.createBlog(data);

      if (isValidBlogCreateResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
    },
    onSuccess: (data: unknown) => {
      if (isValidBlogCreateResponse(data)) {
        toast.success(BLOG_MESSAGES.SUCCESS.CREATED);

        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.allBlogs(),
        });
      } else {
        toast.error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (
          errorData &&
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
          : BLOG_MESSAGES.ERROR.CREATE_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useUpdateBlog = (): UseMutationResult<
  BlogCreateResponse,
  unknown,
  { id: string; data: BlogUpdateRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    BlogCreateResponse,
    unknown,
    { id: string; data: BlogUpdateRequest }
  >({
    mutationFn: async ({ id, data }): Promise<BlogCreateResponse> => {
      const response = await blogMutations.updateBlog(id, data);

      if (isValidBlogCreateResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
    },
    onSuccess: (data: unknown, variables) => {
      if (isValidBlogCreateResponse(data)) {
        toast.success(BLOG_MESSAGES.SUCCESS.UPDATED);

        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.detail(variables.id),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.bySlug(data.slug),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.allBlogs(),
        });
      } else {
        toast.error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (
          errorData &&
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
          : BLOG_MESSAGES.ERROR.UPDATE_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useDeleteBlog = (): UseMutationResult<
  BlogDeleteResponse,
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<BlogDeleteResponse, unknown, string>({
    mutationFn: async (id: string): Promise<BlogDeleteResponse> => {
      const response = await blogMutations.deleteBlog(id);

      if (isValidBlogDeleteResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_DELETE_RESPONSE);
    },
    onSuccess: (data: unknown, id) => {
      if (isValidBlogDeleteResponse(data)) {
        toast.success(BLOG_MESSAGES.SUCCESS.DELETED);

        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.detail(id),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.allBlogs(),
        });
      } else {
        toast.error(BLOG_MESSAGES.ERROR.INVALID_DELETE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (
          errorData &&
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
          : BLOG_MESSAGES.ERROR.DELETE_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const usePublishBlog = (): UseMutationResult<
  BlogCreateResponse,
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<BlogCreateResponse, unknown, string>({
    mutationFn: async (id: string): Promise<BlogCreateResponse> => {
      const response = await blogMutations.publishBlog(id);

      if (isValidBlogCreateResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
    },
    onSuccess: (data: unknown, id) => {
      if (isValidBlogCreateResponse(data)) {
        toast.success(BLOG_MESSAGES.SUCCESS.PUBLISHED);

        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.detail(id),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.bySlug(data.slug),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.allBlogs(),
        });
      } else {
        toast.error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (
          errorData &&
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
          : BLOG_MESSAGES.ERROR.PUBLISH_FAILED;
      toast.error(fallbackMessage);
    },
  });
};

export const useUnpublishBlog = (): UseMutationResult<
  BlogCreateResponse,
  unknown,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<BlogCreateResponse, unknown, string>({
    mutationFn: async (id: string): Promise<BlogCreateResponse> => {
      const response = await blogMutations.unpublishBlog(id);

      if (isValidBlogCreateResponse(response)) {
        return response;
      }

      throw new Error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
    },
    onSuccess: (data: unknown, id) => {
      if (isValidBlogCreateResponse(data)) {
        toast.success(BLOG_MESSAGES.SUCCESS.UNPUBLISHED);

        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.detail(id),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.bySlug(data.slug),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: blogQueryKeys.allBlogs(),
        });
      } else {
        toast.error(BLOG_MESSAGES.ERROR.INVALID_CREATE_RESPONSE);
      }
    },
    onError: (error: unknown): void => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as unknown;

        if (
          errorData &&
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
          : BLOG_MESSAGES.ERROR.UNPUBLISH_FAILED;
      toast.error(fallbackMessage);
    },
  });
};
