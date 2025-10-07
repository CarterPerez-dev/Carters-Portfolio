// ===========================
// Contact API Type Definitions
// ©AngelaMos | 2025
// ===========================

export interface ContactCreateRequest {
  name?: string | null;
  subject: string;
  body: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
}

export interface ContactCreateResponse {
  contact_id: string;
  email_sent: boolean;
}

export interface ContactResponse {
  id: string;
  name: string | null;
  subject: string;
  body: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactListResponse {
  contacts: ContactResponse[];
  total: number;
  limit: number;
}

export interface ContactErrorResponse {
  error: string;
  code: string;
  context?: Record<string, unknown> | null;
}
