// ===========================
// Application Constants
// ©AngelaMos | 2025
// ===========================

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  UI: 'ui-storage',
  TYPING_PREFIX: 'typed_',
} as const;

export const ADMIN_CONFIG = {
  EMAIL: import.meta.env.VITE_ADMIN_EMAIL ?? 'cartertechsolution@gmail.com',
} as const;

export const ERROR_MESSAGES = {
  NO_REFRESH_TOKEN: 'No refresh token available',
  ROOT_ELEMENT_NOT_FOUND: 'Root element not found',
} as const;

export const CONTACT_MESSAGES = {
  SUCCESS: {
    EMAIL_SENT: "Message sent successfully! I'll get back to you soon.",
    EMAIL_FAILED:
      "Message received! Note: Email notification failed, but I'll still see your message.",
  },
  ERROR: {
    INVALID_SUBMISSION_RESPONSE:
      'Server returned invalid contact submission response',
    INVALID_LIST_RESPONSE: 'Server returned invalid contact list response',
    INVALID_CONTACT_RESPONSE: 'Server returned invalid contact response',
    UNEXPECTED_FORMAT: 'Message saved but response format was unexpected',
    SEND_FAILED: 'Failed to send message. Please try again.',
  },
} as const;

export const BLOG_MESSAGES = {
  SUCCESS: {
    CREATED: 'Blog post created successfully!',
    UPDATED: 'Blog post updated successfully!',
    DELETED: 'Blog post deleted successfully!',
    PUBLISHED: 'Blog post published successfully!',
    UNPUBLISHED: 'Blog post unpublished successfully!',
  },
  ERROR: {
    INVALID_BLOG_RESPONSE: 'Server returned invalid blog response',
    INVALID_LIST_RESPONSE: 'Server returned invalid blog list response',
    INVALID_CREATE_RESPONSE:
      'Server returned invalid blog creation response',
    INVALID_DELETE_RESPONSE:
      'Server returned invalid blog deletion response',
    LOAD_FAILED: 'Failed to load blog posts. Please try again.',
    CREATE_FAILED: 'Failed to create blog post. Please try again.',
    UPDATE_FAILED: 'Failed to update blog post. Please try again.',
    DELETE_FAILED: 'Failed to delete blog post. Please try again.',
    PUBLISH_FAILED: 'Failed to publish blog post. Please try again.',
    UNPUBLISH_FAILED: 'Failed to unpublish blog post. Please try again.',
    SEARCH_FAILED: 'Failed to search blogs. Please try again.',
  },
} as const;

export const PROJECT_MESSAGES = {
  SUCCESS: {
    UPDATED: 'Project updated successfully!',
    VISIBILITY_TOGGLED: 'Project visibility toggled successfully!',
    FEATURED_TOGGLED: 'Project featured status toggled successfully!',
    SYNCED_ALL: 'All projects synced from GitHub successfully!',
    SYNCED_SINGLE: 'Project synced from GitHub successfully!',
  },
  ERROR: {
    INVALID_PROJECT_RESPONSE: 'Server returned invalid project response',
    INVALID_LIST_RESPONSE: 'Server returned invalid project list response',
    INVALID_UPDATE_RESPONSE:
      'Server returned invalid project update response',
    INVALID_STATS_RESPONSE: 'Server returned invalid project stats response',
    INVALID_SYNC_RESPONSE: 'Server returned invalid sync response',
    LOAD_FAILED: 'Failed to load projects. Please try again.',
    UPDATE_FAILED: 'Failed to update project. Please try again.',
    SEARCH_FAILED: 'Failed to search projects. Please try again.',
    SYNC_FAILED: 'Failed to sync projects from GitHub. Please try again.',
    VISIBILITY_TOGGLE_FAILED:
      'Failed to toggle project visibility. Please try again.',
    FEATURED_TOGGLE_FAILED:
      'Failed to toggle project featured status. Please try again.',
  },
} as const;
