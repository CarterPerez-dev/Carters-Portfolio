// ===========================
// Blog API Type Definitions
// ©AngelaMos | 2025
// ===========================

export interface BlogCreateRequest {
  title: string;
  slug?: string | null;
  content: string;
  excerpt: string;
  author?: string;
  published?: boolean;
  featured_image?: string | null;
  tags?: string[];
  meta_description: string;
}

export interface BlogUpdateRequest {
  title?: string | null;
  content?: string | null;
  excerpt?: string | null;
  author?: string | null;
  published?: boolean | null;
  featured_image?: string | null;
  tags?: string[] | null;
  meta_description?: string | null;
}

export interface BlogSearchRequest {
  query: string;
  tag?: string | null;
  limit?: number;
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  featured_image: string | null;
  tags: string[];
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPreviewResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  published: boolean;
  featured_image: string | null;
  tags: string[];
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  blogs: BlogPreviewResponse[];
  total: number;
  limit: number;
  offset?: number;
}

export interface BlogCreateResponse {
  blog_id: string;
  slug: string;
  published: boolean;
}

export interface BlogDeleteResponse {
  message: string;
  deleted: boolean;
}
