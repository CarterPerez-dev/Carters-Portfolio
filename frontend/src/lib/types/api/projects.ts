// ===========================
// Project API Type Definitions
// ©AngelaMos | 2025
// ===========================

export interface ProjectUpdateRequest {
  custom_title?: string | null;
  custom_description?: string | null;
  long_description?: string | null;
  featured?: boolean | null;
  display_order?: number | null;
  is_visible?: boolean | null;
  tech_stack?: string[] | null;
  project_type?: string | null;
  demo_url?: string | null;
  documentation_url?: string | null;
  case_study_url?: string | null;
  screenshots?: string[] | null;
  thumbnail_url?: string | null;
}

export interface ProjectSearchRequest {
  query?: string | null;
  language?: string | null;
  project_type?: string | null;
  limit?: number;
}

export interface ProjectResponse {
  id: string;
  github_id: number;
  name: string;
  description: string | null;
  long_description: string | null;
  github_url: string;
  demo_url: string | null;
  tech_stack: string[];
  project_type: string;
  screenshots: string[];
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  last_updated: string | null;
  activity_score: number;
  featured: boolean;
  is_active: boolean;
}

export interface ProjectPreviewResponse {
  id: string;
  github_id: number;
  name: string;
  description: string | null;
  long_description: string | null;
  thumbnail: string | null;
  github_url: string;
  github_owner: string | null;
  github_full_name: string | null;
  demo_url: string | null;
  documentation_url: string | null;
  case_study_url: string | null;
  stars: number;
  watchers: number | null;
  forks: number;
  open_issues: number | null;
  language: string | null;
  tech_stack: string[];
  topics: string[];
  project_type: string;
  featured: boolean;
  is_visible: boolean;
  activity_score: number;
  last_updated: string | null;
  created_at: string | null;
  clone_url: string | null;
  homepage_url: string | null;
  screenshots: string[];
}

export interface ProjectListResponse {
  projects: ProjectPreviewResponse[];
  total: number;
  limit: number;
  featured_count?: number;
}

export interface ProjectCreateResponse {
  project_id: string;
  github_id: number;
  created: boolean;
}

export interface ProjectUpdateResponse {
  project_id: string;
  github_id: number;
  updated_fields: string[];
}

export interface ProjectVisibilityResponse {
  project_id: string;
  is_visible: boolean;
}

export interface ProjectFeaturedResponse {
  project_id: string;
  featured: boolean;
}

export interface ProjectStatsResponse {
  total_projects: number;
  featured_projects: number;
  active_projects: number;
  total_stars: number;
  total_forks: number;
  top_languages: Record<string, number>;
}

export interface GitHubSyncResponse {
  synced: number;
  created: number;
  updated: number;
  errors: string[];
  timestamp: string;
}

export interface GitHubSyncSingleResponse {
  success: boolean;
  project_id?: string;
  created?: boolean;
  github_id?: number;
  error?: string;
}

export interface WebhookResponse {
  status: string;
  event: string | null;
  delivery_id: string | null;
  result: Record<string, unknown> | null;
}

export interface GitHubRateLimitResponse {
  limit?: number;
  remaining?: number;
  reset?: string;
  authenticated?: boolean;
  error?: string;
}

export type ProjectType =
  | 'web-app'
  | 'cli-tool'
  | 'library'
  | 'mobile-app'
  | 'api'
  | 'other';
