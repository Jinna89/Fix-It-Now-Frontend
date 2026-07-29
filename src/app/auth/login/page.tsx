'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Wrench } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import { ApiClientError } from '@/lib/api/client';
import type { Role } from '@/lib/types';

const dashboardPath: Record<Role, string> = {
  CUSTOMER: '/dashboard/customer',
  TECHNICIAN: '/dashboard/technician',
  ADMIN: '/dashboard/admin',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      router.push(next || dashboardPath[user.role]);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LoginInput, { message });
        });
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-amber">
            <Wrench className="h-4 w-4" />
          </span>
          FixItNow
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to manage your bookings.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          </Field>

          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          </Field>

          {serverError && (
            <p className="rounded-md bg-status-declined/10 px-3 py-2 text-sm text-status-declined">{serverError}</p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&rsquo;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-navy hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-6 rounded-md bg-paper p-3 text-xs text-muted">
          <p className="font-semibold text-ink">Demo credentials</p>
          <p className="mt-1">Admin: admin@fixitnow.com / Admin@12345</p>
          <p>Technician: karim@example.com / Passw0rd!</p>
          <p>Customer: farhan@example.com / Passw0rd!</p>
        </div>
      </div>
    </div>
  );
}
