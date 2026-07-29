'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Tags } from 'lucide-react';
import { getAdminCategories, createCategory } from '@/lib/api/admin';
import { categorySchema, type CategoryInput } from '@/lib/validators/admin';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApiClientError } from '@/lib/api/client';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({ queryKey: ['admin-categories'], queryFn: getAdminCategories });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({ resolver: zodResolver(categorySchema) });

  const mutation = useMutation({
    mutationFn: (values: CategoryInput) => createCategory({ name: values.name, description: values.description || undefined }),
    onSuccess: () => {
      toast.success('Category created.');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset();
    },
    onError: (err) => {
      if (err instanceof ApiClientError) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => setError(field as keyof CategoryInput, { message }));
        if (!Object.keys(err.fieldErrors).length) toast.error(err.message);
      } else {
        toast.error('Could not create category.');
      }
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Service categories</h1>
      <p className="mt-1 text-sm text-muted">Organize the categories technicians can list their services under.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-line bg-surface">
          {categoriesQuery.isLoading && (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
          {categoriesQuery.isSuccess && categoriesQuery.data.length === 0 && (
            <p className="p-6 text-center text-sm text-muted">No categories yet — add the first one.</p>
          )}
          {(categoriesQuery.data || []).length > 0 && (
            <table className="w-full text-left text-sm">
              <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {(categoriesQuery.data || []).map((c) => (
                  <tr key={c.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-muted">{c.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="h-fit space-y-4 rounded-lg border border-line bg-surface p-5"
        >
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <Tags className="h-4 w-4 text-amber-600" /> New category
          </h2>
          <Field label="Name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" placeholder="e.g. Electrical" {...register('name')} />
          </Field>
          <Field label="Description (optional)" htmlFor="description" error={errors.description?.message}>
            <Textarea id="description" rows={3} {...register('description')} />
          </Field>
          <Button type="submit" className="w-full" isLoading={isSubmitting || mutation.isPending}>
            Create category
          </Button>
        </form>
      </div>
    </div>
  );
}
