'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CalendarPlus, Lock } from 'lucide-react';
import { getMyAvailability, updateAvailability } from '@/lib/api/technician';
import { slotSchema, type SlotInput } from '@/lib/validators/technician';
import { Input } from '@/components/ui/Input';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApiClientError } from '@/lib/api/client';
import { formatDate } from '@/lib/utils';

export function AvailabilityScheduler() {
  const queryClient = useQueryClient();
  const availabilityQuery = useQuery({ queryKey: ['technician-availability'], queryFn: getMyAvailability });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SlotInput>({
    resolver: zodResolver(slotSchema),
    defaultValues: { date: '', startTime: '09:00', endTime: '11:00' },
  });

  const mutation = useMutation({
    mutationFn: (slot: SlotInput) => updateAvailability([slot]),
    onSuccess: () => {
      toast.success('Time block added to your schedule.');
      queryClient.invalidateQueries({ queryKey: ['technician-availability'] });
      reset({ date: '', startTime: '09:00', endTime: '11:00' });
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not save availability.');
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof availabilityQuery.data>();
    for (const slot of availabilityQuery.data || []) {
      const key = slot.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      (map.get(key) as any[]).push(slot);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [availabilityQuery.data]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="h-fit space-y-4 rounded-lg border border-line bg-surface p-5"
      >
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <CalendarPlus className="h-5 w-5 text-amber-600" /> Add a time block
        </h2>

        <Field label="Date" htmlFor="date" error={errors.date?.message}>
          <Input id="date" type="date" min={new Date().toISOString().slice(0, 10)} {...register('date')} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start" htmlFor="startTime" error={errors.startTime?.message}>
            <Input id="startTime" type="time" {...register('startTime')} />
          </Field>
          <Field label="End" htmlFor="endTime" error={errors.endTime?.message}>
            <Input id="endTime" type="time" {...register('endTime')} />
          </Field>
        </div>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Add to schedule
        </Button>
      </form>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Your upcoming schedule</h2>
        <div className="mt-4 space-y-4">
          {availabilityQuery.isLoading && <Skeleton className="h-40 w-full" />}
          {availabilityQuery.isSuccess && grouped.length === 0 && (
            <p className="rounded-lg border border-dashed border-line bg-surface p-6 text-center text-sm text-muted">
              No time blocks yet. Add one to let customers book you.
            </p>
          )}
          {grouped.map(([date, slots]) => (
            <div key={date} className="rounded-lg border border-line bg-surface p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">{formatDate(date)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(slots || []).map((slot: any) => (
                  <span
                    key={slot.id}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs ${
                      slot.isBooked
                        ? 'border-status-accepted/30 bg-status-accepted/10 text-status-accepted'
                        : 'border-line bg-paper text-ink'
                    }`}
                  >
                    {slot.isBooked && <Lock className="h-3 w-3" />}
                    {slot.startTime}–{slot.endTime}
                    {slot.isBooked && <span className="text-[10px] uppercase">Booked</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
