import { clearSession, getAccessToken, getRefreshToken, updateTokens } from '@/lib/auth/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

export class ApiClientError extends Error {
  statusCode: number;
  errorDetails: unknown;
  fieldErrors: Record<string, string>;

  constructor(statusCode: number, message: string, errorDetails: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    this.fieldErrors = extractFieldErrors(errorDetails);
  }
}

// The backend's zod `validate` middleware reports issues in errorDetails.
// This normalizes a few likely shapes into a flat { fieldName: message } map
// so forms can show inline errors regardless of exact shape.
function extractFieldErrors(errorDetails: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!errorDetails) return out;

  const issues = Array.isArray(errorDetails)
    ? errorDetails
    : (errorDetails as any)?.issues || (errorDetails as any)?.errors;

  if (Array.isArray(issues)) {
    for (const issue of issues) {
      const path = Array.isArray(issue?.path) ? issue.path.join('.') : issue?.path;
      if (path && issue?.message) out[path] = issue.message;
    }
  }
  return out;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
  isRetry?: boolean;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) return null;
    updateTokens(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken as string;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, isRetry, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: 'no-store',
  });

  // Token expired mid-session: try one silent refresh, then retry once.
  if (res.status === 401 && auth && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, { ...options, isRetry: true });
    }
    clearSession();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fixitnow:session-expired'));
    }
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // no body
  }

  if (!res.ok || !json?.success) {
    throw new ApiClientError(
      res.status,
      json?.message || 'Something went wrong. Please try again.',
      json?.errorDetails
    );
  }

  return json.data as T;
}

export async function apiFetchWithMeta<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T; meta: any }> {
  const { auth = true, isRetry, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders, cache: 'no-store' });

  if (res.status === 401 && auth && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) return apiFetchWithMeta<T>(path, { ...options, isRetry: true });
    clearSession();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fixitnow:session-expired'));
    }
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok || !json?.success) {
    throw new ApiClientError(res.status, json?.message || 'Something went wrong.', json?.errorDetails);
  }

  return { data: json.data as T, meta: json.meta };
}

export function buildQuery(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
