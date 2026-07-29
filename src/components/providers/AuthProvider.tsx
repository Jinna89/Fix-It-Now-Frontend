'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as authApi from '@/lib/api/auth';
import { clearSession, getRefreshToken, getStoredUser, setSession } from '@/lib/auth/session';
import type { LoginInput, RegisterInput } from '@/lib/validators/auth';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);

    const onExpire = () => {
      setUser(null);
      toast.error('Your session expired. Please sign in again.');
      router.push('/auth/login');
    };
    window.addEventListener('fixitnow:session-expired', onExpire);
    return () => window.removeEventListener('fixitnow:session-expired', onExpire);
  }, [router]);

  const login = useCallback(async (input: LoginInput) => {
    const res = await authApi.login(input);
    setSession(res.accessToken, res.refreshToken, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const { confirmPassword, ...payload } = input;
    const res = await authApi.register({ ...payload, phone: payload.phone || undefined });
    setSession(res.accessToken, res.refreshToken, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore network errors on logout
    }
    clearSession();
    setUser(null);
    router.push('/');
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
