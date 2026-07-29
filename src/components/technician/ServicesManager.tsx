'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PackagePlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { serviceFormSchema, type ServiceFormInput } from '@/lib/validators/technician';
import { createTechnicianService, updateTechnicianService } from '@/lib/api/technician';
import { getCategories } from '@/lib/api/services';
import { ApiClientError } from '@/lib/api/client';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/lib/types';

export function ServicesManager({ services }: { services: Service[] }) {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: { categoryId: '', title: '', description: '', location: '' },
  });

  const createMutation = useMutation({
    mutationFn: (values: ServiceFormInput) =>
      createTechnicianService({
        categoryId: values.categoryId,
        title: values.title,
        description: values.description || undefined,
        price: values.price,
        durationMins: values.durationMins,
        location: values.location || undefined,
      }),
    onSuccess: () => {
      toast.success('Service added.');
      queryClient.invalidateQueries({ queryKey: ['technician-profile'] });
      reset({ categoryId: '', title: '', description: '', location: '' });
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not add service.');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateTechnicianService(id, { isActive }),
    onSuccess: () => {
      toast.success('Service updated.');
      queryClient.invalidateQueries({ queryKey: ['technician-profile'] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update service.');
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Your services</h2>
        {services.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No services yet — add your first one below.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-md border border-line p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{service.title}</p>
                  <p className="text-xs text-muted">
                    {service.category?.name} &middot; {formatCurrency(service.price)} &middot; {service.durationMins} mins
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={service.isActive ? 'outline' : 'secondary'}
                  isLoading={toggleMutation.isPending && toggleMutation.variables?.id === service.id}
                  onClick={() => toggleMutation.mutate({ id: service.id, isActive: !service.isActive })}
                >
                  {service.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit((v) => createMutation.mutate(v))}
        className="space-y-4 rounded-lg border border-line bg-surface p-5"
      >
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <PackagePlus className="h-5 w-5 text-amber-600" /> Add a service
        </h2>

        <Field label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
          <Select id="categoryId" {...register('categoryId')}>
            <option value="">Select a category</option>
            {(categoriesQuery.data || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" placeholder="e.g. Ceiling fan installation" {...register('title')} />
        </Field>

        <Field label="Description (optional)" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={3} {...register('description')} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (৳)" htmlFor="price" error={errors.price?.message}>
            <Input id="price" type="number" min={0} step="0.01" {...register('price')} />
          </Field>
          <Field label="Duration (mins)" htmlFor="durationMins" error={errors.durationMins?.message}>
            <Input id="durationMins" type="number" min={1} placeholder="60" {...register('durationMins')} />
          </Field>
        </div>

        <Field label="Location (optional)" htmlFor="location" error={errors.location?.message}>
          <Input id="location" placeholder="Area you cover for this service" {...register('location')} />
        </Field>

        <Button type="submit" isLoading={createMutation.isPending}>
          Add service
        </Button>
      </form>
    </div>
  );
}
