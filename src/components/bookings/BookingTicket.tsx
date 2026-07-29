import type { Booking } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * The "job ticket" is FixItNow's signature booking motif: a work-order stub,
 * perforated between the job summary and its status/actions — like the tear-off
 * receipt a technician would leave behind after a house call.
 */
export function BookingTicket({
  booking,
  actions,
  roleLabel,
}: {
  booking: Booking;
  actions?: React.ReactNode;
  roleLabel?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-sm sm:flex-row">
      <div className="flex-1 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Job #{booking.id.slice(0, 8)}
            </p>
            <h3 className="font-display text-lg font-semibold text-ink">
              {booking.service?.title || 'Service'}
            </h3>
          </div>
          {roleLabel}
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted">Scheduled</dt>
            <dd className="font-medium text-ink">{formatDateTime(booking.scheduledAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Price</dt>
            <dd className="font-medium text-ink">{formatCurrency(booking.service?.price ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Technician</dt>
            <dd className="font-medium text-ink">{booking.technician?.user?.name || '—'}</dd>
          </div>
        </dl>

        {booking.notes && (
          <p className="mt-3 rounded-md bg-paper px-3 py-2 text-sm text-muted">
            &ldquo;{booking.notes}&rdquo;
          </p>
        )}
        {booking.cancelReason && booking.status === 'CANCELLED' && (
          <p className="mt-3 text-xs text-status-cancelled">Reason: {booking.cancelReason}</p>
        )}
      </div>

      {/* Perforated divider */}
      <div className="relative hidden w-0 sm:block">
        <div className="absolute inset-y-0 left-0 border-l border-dashed border-line" />
        <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-paper" />
        <div className="absolute -left-2 -bottom-2 h-4 w-4 rounded-full bg-paper" />
      </div>
      <div className="block h-0 border-t border-dashed border-line sm:hidden" />

      <div className="flex w-full flex-col justify-center gap-3 bg-paper/60 p-4 sm:w-48 sm:p-5">
        <StatusBadge status={booking.status} />
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
