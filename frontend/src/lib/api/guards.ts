// ===========================
// API Response Guards & Types
// ©AngelaMos | 2025
// ===========================

export interface BackendErrorResponse {
  error: string;
  code: string;
  request_id?: string;
}

export const isBackendErrorResponse = (
  data: unknown,
): data is BackendErrorResponse => {
  if (data === null || data === undefined) return false;
  if (typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.error === 'string' &&
    typeof obj.code === 'string' &&
    (obj.request_id === undefined || typeof obj.request_id === 'string')
  );
};
