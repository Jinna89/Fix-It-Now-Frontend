import { apiFetch } from './client';
import type { Role, User } from '@/lib/types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function register(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function logout(refreshToken: string) {
  return apiFetch<null>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    auth: false,
  });
}

export function me() {
  return apiFetch<User>('/auth/me');
}
