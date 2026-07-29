'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Wrench, HardHat, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { ApiClientError } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

const dashboardPath: Record<Role, string> = {
  CUSTOMER: '/dashboard/customer',
  TECHNICIAN: '/dashboard/technician',
  ADMIN: '/dashboard/admin',
};

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER', phone: '' },
  });

  const role = watch('role');

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    try {
      const user = await registerUser(values);
      toast.success(`Welcome to FixItNow, ${user.name.split(' ')[0]}!`);
      router.push(dashboardPath[user.role]);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof RegisterInput, { message });
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
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Book trusted pros or offer your own services.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-ink">I want to&hellip;</p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { role: 'CUSTOMER' as Role, label: 'Book services', icon: UserIcon },
                  { role: 'TECHNICIAN' as Role, label: 'Offer services', icon: HardHat },
                ]
              ).map(({ role: r, label, icon: Icon }) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setValue('role', r)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-md border px-3 py-4 text-sm font-medium transition-colors',
                    role === r ? 'border-navy bg-navy text-paper' : 'border-line text-ink hover:border-navy-400'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Full name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" placeholder="Jane Doe" {...register('name')} />
          </Field>

          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          </Field>

          <Field label="Phone (optional)" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" placeholder="017XXXXXXXX" {...register('phone')} />
          </Field>

          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" placeholder="At least 6 characters" {...register('password')} />
          </Field>

          <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          </Field>

          {serverError && (
            <p className="rounded-md bg-status-declined/10 px-3 py-2 text-sm text-status-declined">{serverError}</p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-navy hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
