// ===========================
// Contact Type Guards
// ©AngelaMos | 2025
// ===========================

import type {
  ContactCreateResponse,
  ContactResponse,
  ContactListResponse,
  ContactErrorResponse,
} from '@/lib/types/api/contact';

export const isValidContactCreateResponse = (
  data: unknown,
): data is ContactCreateResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.contact_id === 'string' && typeof obj.email_sent === 'boolean'
  );
};

export const isValidContactResponse = (
  data: unknown,
): data is ContactResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    (obj.name === null || typeof obj.name === 'string') &&
    typeof obj.subject === 'string' &&
    typeof obj.body === 'string' &&
    (obj.email === null || typeof obj.email === 'string') &&
    (obj.phone === null || typeof obj.phone === 'string') &&
    (obj.linkedin === null || typeof obj.linkedin === 'string') &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
};

export const isValidContactListResponse = (
  data: unknown,
): data is ContactListResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.contacts)) return false;
  if (typeof obj.total !== 'number') return false;
  if (typeof obj.limit !== 'number') return false;

  return obj.contacts.every(isValidContactResponse);
};

export const isContactErrorResponse = (
  data: unknown,
): data is ContactErrorResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.error === 'string' &&
    typeof obj.code === 'string' &&
    (obj.context === undefined ||
      obj.context === null ||
      typeof obj.context === 'object')
  );
};
