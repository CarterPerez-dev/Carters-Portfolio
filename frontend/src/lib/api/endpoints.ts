// ===========================
// API Endpoints
// ©AngelaMos | 2025
// ===========================

export const API_ENDPOINTS = {
  admin: {
    login: '/admin/auth/login',
    logout: '/admin/auth/logout',
    status: '/admin/auth/status',
    refresh: '/admin/auth/refresh',
    githubAuth: '/admin/auth/github',
    githubCallback: '/admin/auth/github/callback',
    githubTokens: '/admin/auth/github/tokens',
  },
  projects: {
    list: '/projects',
    get: (id: string) => `/projects/${id}`,
    getByGitHubId: (githubId: number) =>
      `/projects/github/${githubId.toString()}`,
    update: (id: string) => `/projects/${id}`,
    toggleVisibility: (id: string) => `/projects/${id}/visibility`,
    toggleFeatured: (id: string) => `/projects/${id}/featured`,
    stats: '/projects/stats',
    search: '/projects/search',
    sync: {
      all: '/projects/sync/github',
      single: (repoName: string) => `/projects/sync/github/${repoName}`,
    },
    webhook: '/projects/webhook/github',
    rateLimit: '/projects/github/rate-limit',
  },
  blogs: {
    list: '/blogs',
    all: '/blogs/all',
    get: (id: string) => `/blogs/${id}`,
    getBySlug: (slug: string) => `/blogs/slug/${slug}`,
    create: '/blogs',
    update: (id: string) => `/blogs/${id}`,
    delete: (id: string) => `/blogs/${id}`,
    publish: (id: string) => `/blogs/${id}/publish`,
    unpublish: (id: string) => `/blogs/${id}/unpublish`,
    search: '/blogs/search',
    byTag: (tag: string) => `/blogs/tag/${tag}`,
  },
  contact: {
    submit: '/contact',
    list: '/contact',
    getById: (id: string) => `/contact/${id}`,
  },
} as const;
