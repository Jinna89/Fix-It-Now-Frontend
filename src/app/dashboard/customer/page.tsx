'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Wallet } from 'lucide-react';
import { getMyBookings } from '@/lib/api/bookings';
import { getMyPayments } from '@/lib/api/payments';
import { BookingTicket } from '@/components/bookings/BookingTicket';
import { CancelBookingModal } from '@/components/bookings/CancelBookingModal';
import { ReviewFormModal } from '@/components/reviews/ReviewFormModal';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { BookingStatus } from '@/lib/types';

const CANCELLABLE: BookingStatus[] = ['REQUESTED', 'ACCEPTED', 'PAID'];

const FILTERS: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Requested', value: 'REQUESTED' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Paid', value: 'PAID' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function CustomerDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);

  const bookingsQuery = useQuery({ queryKey: ['my-bookings'], queryFn: () => getMyBookings() });
  const paymentsQuery = useQuery({ queryKey: ['my-payments'], queryFn: getMyPayments });

  const bookings = (bookingsQuery.data || []).filter(
    (b) => statusFilter === 'ALL' || b.status === statusFilter
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">My bookings</h1>
        <p className="mt-1 text-sm text-muted">Track every job from request to completion.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === f.value ? 'border-navy bg-navy text-paper' : 'border-line text-muted hover:text-ink'
              }`}
            >
              {f.label}
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
              No bookings here yet.{' '}
              <Link href="/services" className="font-medium text-navy hover:underline">
                Browse services
              </Link>{' '}
              to book your first job.
            </div>
          )}

          {bookings.map((booking) => (
            <BookingTicket
              key={booking.id}
              booking={booking}
              actions={
                <>
                  {booking.status === 'ACCEPTED' && (
                    <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
                      <Button size="sm">Pay now</Button>
                    </Link>
                  )}
                  {CANCELLABLE.includes(booking.status) && (
                    <Button size="sm" variant="outline" onClick={() => setCancelTarget(booking.id)}>
                      Cancel
                    </Button>
                  )}
                  {booking.status === 'COMPLETED' && !booking.review && (
                    <Button size="sm" variant="secondary" onClick={() => setReviewTarget(booking.id)}>
                      Leave review
                    </Button>
                  )}
                  {booking.status === 'COMPLETED' && booking.review && (
                    <span className="text-xs text-muted">Reviewed ✓</span>
                  )}
                </>
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
          <Wallet className="h-5 w-5 text-amber-600" /> Payment history
        </h2>

        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentsQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    Loading&hellip;
                  </td>
                </tr>
              )}
              {paymentsQuery.isSuccess && (paymentsQuery.data || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    No payments yet.
                  </td>
                </tr>
              )}
              {(paymentsQuery.data || []).map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-xs">{p.transactionId}</td>
                  <td className="px-4 py-3">{p.booking?.service?.title || '—'}</td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === 'COMPLETED'
                          ? 'bg-status-progress/10 text-status-progress'
                          : p.status === 'FAILED'
                          ? 'bg-status-declined/10 text-status-declined'
                          : 'bg-status-requested/10 text-status-requested'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cancelTarget && (
        <CancelBookingModal bookingId={cancelTarget} open={!!cancelTarget} onClose={() => setCancelTarget(null)} />
      )}
      {reviewTarget && (
        <ReviewFormModal bookingId={reviewTarget} open={!!reviewTarget} onClose={() => setReviewTarget(null)} />
      )}
    </div>
  );
}
