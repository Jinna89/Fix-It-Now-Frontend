import Cookies from 'js-cookie';
import type { Role, User } from '@/lib/types';

const TOKEN_KEY = 'fn_token';
const REFRESH_KEY = 'fn_refresh';
const ROLE_KEY = 'fn_role';
const USER_KEY = 'fn_user';

const COOKIE_OPTS = { expires: 7, sameSite: 'lax' as const, path: '/' };

export function setSession(accessToken: string, refreshToken: string, user: User) {
  Cookies.set(TOKEN_KEY, accessToken, COOKIE_OPTS);
  Cookies.set(REFRESH_KEY, refreshToken, COOKIE_OPTS);
  Cookies.set(ROLE_KEY, user.role, COOKIE_OPTS);
  Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTS);
}

export function updateTokens(accessToken: string, refreshToken: string) {
  Cookies.set(TOKEN_KEY, accessToken, COOKIE_OPTS);
  Cookies.set(REFRESH_KEY, refreshToken, COOKIE_OPTS);
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  Cookies.remove(REFRESH_KEY, { path: '/' });
  Cookies.remove(ROLE_KEY, { path: '/' });
  Cookies.remove(USER_KEY, { path: '/' });
}

export function getAccessToken() {
  return Cookies.get(TOKEN_KEY) || null;
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_KEY) || null;
}

export function getRole(): Role | null {
  return (Cookies.get(ROLE_KEY) as Role) || null;
}

export function getStoredUser(): User | null {
  const raw = Cookies.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
