// ===========================
// Project Type Guards
// ©AngelaMos | 2025
// ===========================

import type {
  ProjectResponse,
  ProjectPreviewResponse,
  ProjectListResponse,
  ProjectUpdateResponse,
  ProjectVisibilityResponse,
  ProjectFeaturedResponse,
  ProjectStatsResponse,
  GitHubSyncResponse,
  GitHubSyncSingleResponse,
  WebhookResponse,
  GitHubRateLimitResponse,
} from '@/lib/types/api/projects';

export const isValidProjectResponse = (
  data: unknown,
): data is ProjectResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.github_id === 'number' &&
    typeof obj.name === 'string' &&
    (obj.description === null || typeof obj.description === 'string') &&
    (obj.long_description === null ||
      typeof obj.long_description === 'string') &&
    typeof obj.github_url === 'string' &&
    (obj.demo_url === null || typeof obj.demo_url === 'string') &&
    Array.isArray(obj.tech_stack) &&
    obj.tech_stack.every((tech: unknown) => typeof tech === 'string') &&
    typeof obj.project_type === 'string' &&
    Array.isArray(obj.screenshots) &&
    obj.screenshots.every(
      (screenshot: unknown) => typeof screenshot === 'string',
    ) &&
    typeof obj.stars === 'number' &&
    typeof obj.forks === 'number' &&
    (obj.language === null || typeof obj.language === 'string') &&
    Array.isArray(obj.topics) &&
    obj.topics.every((topic: unknown) => typeof topic === 'string') &&
    (obj.last_updated === null || typeof obj.last_updated === 'string') &&
    typeof obj.activity_score === 'number' &&
    typeof obj.featured === 'boolean' &&
    typeof obj.is_active === 'boolean'
  );
};

export const isValidProjectPreviewResponse = (
  data: unknown,
): data is ProjectPreviewResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  const isNullOrUndefined = (val: unknown): val is null | undefined =>
    val === null || val === undefined;

  return (
    typeof obj.id === 'string' &&
    typeof obj.github_id === 'number' &&
    typeof obj.name === 'string' &&
    (isNullOrUndefined(obj.description) ||
      typeof obj.description === 'string') &&
    (isNullOrUndefined(obj.long_description) ||
      typeof obj.long_description === 'string') &&
    (isNullOrUndefined(obj.thumbnail) ||
      typeof obj.thumbnail === 'string') &&
    typeof obj.github_url === 'string' &&
    (isNullOrUndefined(obj.github_owner) ||
      typeof obj.github_owner === 'string') &&
    (isNullOrUndefined(obj.github_full_name) ||
      typeof obj.github_full_name === 'string') &&
    (isNullOrUndefined(obj.demo_url) || typeof obj.demo_url === 'string') &&
    (isNullOrUndefined(obj.documentation_url) ||
      typeof obj.documentation_url === 'string') &&
    (isNullOrUndefined(obj.case_study_url) ||
      typeof obj.case_study_url === 'string') &&
    typeof obj.stars === 'number' &&
    (isNullOrUndefined(obj.watchers) || typeof obj.watchers === 'number') &&
    typeof obj.forks === 'number' &&
    (isNullOrUndefined(obj.open_issues) ||
      typeof obj.open_issues === 'number') &&
    (isNullOrUndefined(obj.language) || typeof obj.language === 'string') &&
    Array.isArray(obj.tech_stack) &&
    obj.tech_stack.every((tech: unknown) => typeof tech === 'string') &&
    Array.isArray(obj.topics) &&
    obj.topics.every((topic: unknown) => typeof topic === 'string') &&
    typeof obj.project_type === 'string' &&
    typeof obj.featured === 'boolean' &&
    (obj.is_visible === undefined || typeof obj.is_visible === 'boolean') &&
    typeof obj.activity_score === 'number' &&
    (isNullOrUndefined(obj.last_updated) ||
      typeof obj.last_updated === 'string') &&
    (isNullOrUndefined(obj.created_at) ||
      typeof obj.created_at === 'string') &&
    (isNullOrUndefined(obj.clone_url) ||
      typeof obj.clone_url === 'string') &&
    (isNullOrUndefined(obj.homepage_url) ||
      typeof obj.homepage_url === 'string') &&
    (isNullOrUndefined(obj.screenshots) ||
      (Array.isArray(obj.screenshots) &&
        obj.screenshots.every(
          (screenshot: unknown) => typeof screenshot === 'string',
        )))
  );
};

export const isValidProjectListResponse = (
  data: unknown,
): data is ProjectListResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.projects)) return false;
  if (typeof obj.total !== 'number') return false;
  if (typeof obj.limit !== 'number') return false;
  if (
    obj.featured_count !== undefined &&
    typeof obj.featured_count !== 'number'
  )
    return false;

  return obj.projects.every(isValidProjectPreviewResponse);
};

export const isValidProjectUpdateResponse = (
  data: unknown,
): data is ProjectUpdateResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.project_id === 'string' &&
    typeof obj.github_id === 'number' &&
    Array.isArray(obj.updated_fields) &&
    obj.updated_fields.every((field: unknown) => typeof field === 'string')
  );
};

export const isValidProjectVisibilityResponse = (
  data: unknown,
): data is ProjectVisibilityResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.project_id === 'string' && typeof obj.is_visible === 'boolean'
  );
};

export const isValidProjectFeaturedResponse = (
  data: unknown,
): data is ProjectFeaturedResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.project_id === 'string' && typeof obj.featured === 'boolean'
  );
};

export const isValidProjectStatsResponse = (
  data: unknown,
): data is ProjectStatsResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.total_projects === 'number' &&
    typeof obj.featured_projects === 'number' &&
    typeof obj.active_projects === 'number' &&
    typeof obj.total_stars === 'number' &&
    typeof obj.total_forks === 'number' &&
    typeof obj.top_languages === 'object' &&
    obj.top_languages !== null &&
    Object.values(obj.top_languages).every(
      (count) => typeof count === 'number',
    )
  );
};

export const isValidGitHubSyncResponse = (
  data: unknown,
): data is GitHubSyncResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.synced === 'number' &&
    typeof obj.created === 'number' &&
    typeof obj.updated === 'number' &&
    Array.isArray(obj.errors) &&
    obj.errors.every((error: unknown) => typeof error === 'string') &&
    typeof obj.timestamp === 'string'
  );
};

export const isValidGitHubSyncSingleResponse = (
  data: unknown,
): data is GitHubSyncSingleResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (typeof obj.success !== 'boolean') return false;

  if (obj.success) {
    return (
      (obj.project_id === undefined || typeof obj.project_id === 'string') &&
      (obj.created === undefined || typeof obj.created === 'boolean') &&
      (obj.github_id === undefined || typeof obj.github_id === 'number')
    );
  } else {
    return obj.error === undefined || typeof obj.error === 'string';
  }
};

export const isValidWebhookResponse = (
  data: unknown,
): data is WebhookResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.status === 'string' &&
    (obj.event === null || typeof obj.event === 'string') &&
    (obj.delivery_id === null || typeof obj.delivery_id === 'string') &&
    (obj.result === null ||
      (typeof obj.result === 'object' && obj.result !== null))
  );
};

export const isValidGitHubRateLimitResponse = (
  data: unknown,
): data is GitHubRateLimitResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    (obj.limit === undefined || typeof obj.limit === 'number') &&
    (obj.remaining === undefined || typeof obj.remaining === 'number') &&
    (obj.reset === undefined || typeof obj.reset === 'string') &&
    (obj.authenticated === undefined ||
      typeof obj.authenticated === 'boolean') &&
    (obj.error === undefined || typeof obj.error === 'string')
  );
};
