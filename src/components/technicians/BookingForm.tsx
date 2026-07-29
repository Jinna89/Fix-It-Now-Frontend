'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBooking } from '@/lib/api/bookings';
import { ApiClientError } from '@/lib/api/client';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { Availability, Service } from '@/lib/types';

export function BookingForm({
  technicianId,
  services,
  availability,
}: {
  technicianId: string;
  services: Service[];
  availability: Availability[];
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [slotId, setSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, Availability[]>();
    for (const slot of availability) {
      const key = slot.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(slot);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [availability]);

  const selectedSlot = availability.find((s) => s.id === slotId) || null;

  const mutation = useMutation({
    mutationFn: () => {
      if (!selectedSlot) throw new Error('Pick a time slot first');
      const scheduledAt = new Date(`${selectedSlot.date.slice(0, 10)}T${selectedSlot.startTime}:00`).toISOString();
      return createBooking({
        serviceId,
        availabilityId: selectedSlot.id,
        scheduledAt,
        notes: notes || undefined,
      });
    },
    onSuccess: () => {
      setSuccess(true);
      toast.success('Booking requested! The technician will accept or decline shortly.');
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not create booking.');
    },
  });

  if (!services.length) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-surface p-6 text-center text-sm text-muted">
        This technician hasn&rsquo;t published any services yet.
      </p>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-status-accepted/30 bg-status-accepted/5 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-status-accepted" />
        <p className="font-display text-lg font-semibold text-ink">Booking requested</p>
        <p className="max-w-xs text-sm text-muted">
          Track its status and pay once the technician accepts, right from your dashboard.
        </p>
        <Button onClick={() => router.push('/dashboard/customer')}>Go to my bookings</Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
        <CalendarClock className="h-5 w-5 text-amber-600" /> Book now
      </h3>

      <div className="mt-4 space-y-4">
        <Field label="Service">
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {formatCurrency(s.price)}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Available time slots</p>
          {slotsByDate.length === 0 ? (
            <p className="rounded-md bg-paper p-3 text-xs text-muted">
              No open slots right now. Check back soon or message the technician after booking.
            </p>
          ) : (
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {slotsByDate.map(([date, slots]) => (
                <div key={date}>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted">{formatDate(date)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSlotId(slot.id)}
                        className={cn(
                          'rounded-md border px-3 py-1.5 font-mono text-xs transition-colors',
                          slot.id === slotId
                            ? 'border-navy bg-navy text-paper'
                            : 'border-line bg-paper text-ink hover:border-navy-400'
                        )}
                      >
                        {slot.startTime}–{slot.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Notes for the technician (optional)">
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything they should know before arriving?" />
        </Field>

        {user ? (
          user.role === 'CUSTOMER' ? (
            <Button
              className="w-full"
              disabled={!selectedSlot}
              isLoading={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              Request booking
            </Button>
          ) : (
            <p className="rounded-md bg-paper p-3 text-xs text-muted">
              Bookings can only be made from a customer account.
            </p>
          )
        ) : (
          <Button className="w-full" onClick={() => router.push(`/auth/login?next=/technicians/${technicianId}`)}>
            Log in to book
          </Button>
        )}
      </div>
    </div>
  );
}
