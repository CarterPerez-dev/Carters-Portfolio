// ===========================
// Blog Type Guards
// ©AngelaMos | 2025
// ===========================

import type {
  BlogResponse,
  BlogPreviewResponse,
  BlogListResponse,
  BlogCreateResponse,
  BlogDeleteResponse,
} from '@/lib/types/api/blogs';

export const isValidBlogResponse = (data: unknown): data is BlogResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.excerpt === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.published === 'boolean' &&
    (obj.featured_image === null ||
      typeof obj.featured_image === 'string') &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: unknown) => typeof tag === 'string') &&
    typeof obj.meta_description === 'string' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
};

export const isValidBlogPreviewResponse = (
  data: unknown,
): data is BlogPreviewResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.excerpt === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.published === 'boolean' &&
    (obj.featured_image === null ||
      typeof obj.featured_image === 'string') &&
    Array.isArray(obj.tags) &&
    obj.tags.every((tag: unknown) => typeof tag === 'string') &&
    typeof obj.meta_description === 'string' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
};

export const isValidBlogListResponse = (
  data: unknown,
): data is BlogListResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.blogs)) return false;
  if (typeof obj.total !== 'number') return false;
  if (typeof obj.limit !== 'number') return false;
  if (obj.offset !== undefined && typeof obj.offset !== 'number')
    return false;

  return obj.blogs.every(isValidBlogPreviewResponse);
};

export const isValidBlogCreateResponse = (
  data: unknown,
): data is BlogCreateResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.blog_id === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.published === 'boolean'
  );
};

export const isValidBlogDeleteResponse = (
  data: unknown,
): data is BlogDeleteResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return typeof obj.message === 'string' && typeof obj.deleted === 'boolean';
};
