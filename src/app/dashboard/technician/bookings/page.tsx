'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import { getMyTechnicianBookings, updateBookingStatus } from '@/lib/api/technician';
import { BookingTicket } from '@/components/bookings/BookingTicket';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ApiClientError } from '@/lib/api/client';
import { initials } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/types';

const NEXT_ACTIONS: Partial<Record<BookingStatus, { label: string; next: BookingStatus; variant: 'primary' | 'danger' | 'secondary' }[]>> = {
  REQUESTED: [
    { label: 'Accept', next: 'ACCEPTED', variant: 'primary' },
    { label: 'Decline', next: 'DECLINED', variant: 'danger' },
  ],
  ACCEPTED: [{ label: 'Cancel', next: 'CANCELLED', variant: 'danger' }],
  PAID: [
    { label: 'Start job', next: 'IN_PROGRESS', variant: 'primary' },
    { label: 'Cancel', next: 'CANCELLED', variant: 'danger' },
  ],
  IN_PROGRESS: [{ label: 'Mark completed', next: 'COMPLETED', variant: 'secondary' }],
};

export default function TechnicianBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ['technician-bookings'],
    queryFn: () => getMyTechnicianBookings(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => updateBookingStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['technician-bookings'] });
      const previous = queryClient.getQueryData<Booking[]>(['technician-bookings']);
      queryClient.setQueryData<Booking[]>(['technician-bookings'], (old) =>
        (old || []).map((b) => (b.id === id ? { ...b, status } : b))
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['technician-bookings'], context.previous);
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update booking.');
    },
    onSuccess: (_data, vars) => {
      toast.success(`Booking marked ${vars.status.replace('_', ' ').toLowerCase()}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-bookings'] });
    },
  });

  const bookings = (bookingsQuery.data || []).filter(
    (b) => statusFilter === 'ALL' || b.status === statusFilter
  );

  const filters: (BookingStatus | 'ALL')[] = [
    'ALL',
    'REQUESTED',
    'ACCEPTED',
    'PAID',
    'IN_PROGRESS',
    'COMPLETED',
    'DECLINED',
    'CANCELLED',
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Booking requests</h1>
      <p className="mt-1 text-sm text-muted">Accept, decline, and progress jobs from request to completion.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
              statusFilter === f ? 'border-navy bg-navy text-paper' : 'border-line text-muted hover:text-ink'
            }`}
          >
            {f.replace('_', ' ').toLowerCase()}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {bookingsQuery.isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}

        {bookingsQuery.isError && (
          <div className="flex items-center gap-2 rounded-lg border border-status-declined/30 bg-status-declined/5 p-4 text-sm text-status-declined">
            <AlertCircle className="h-4 w-4" /> Could not load your bookings.
          </div>
        )}

        {bookingsQuery.isSuccess && bookings.length === 0 && (
          <div className="rounded-lg border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
            No bookings in this category.
          </div>
        )}

        {bookings.map((booking) => (
          <BookingTicket
            key={booking.id}
            booking={booking}
            roleLabel={
              <span className="flex items-center gap-2 rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[9px] font-bold text-amber">
                  {initials(booking.customer?.name || 'C')}
                </span>
                {booking.customer?.name}
              </span>
            }
            actions={(NEXT_ACTIONS[booking.status] || []).map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant}
                isLoading={mutation.isPending && mutation.variables?.id === booking.id}
                onClick={() => mutation.mutate({ id: booking.id, status: action.next })}
              >
                {action.label}
              </Button>
            ))}
          />
        ))}
      </div>
    </div>
  );
}
