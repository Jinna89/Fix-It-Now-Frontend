'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getBookingById } from '@/lib/api/bookings';
import type { Booking } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    getBookingById(bookingId).then(setBooking).catch(() => setBooking(null));
  }, [bookingId]);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-status-progress/10 text-status-progress">
        <CheckCircle2 className="h-9 w-9" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">Payment successful</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Your job ticket is now marked <span className="font-semibold text-ink">PAID</span>. The technician has
        been notified and will start the job soon.
      </p>

      {booking?.service && (
        <div className="mt-6 w-full max-w-sm rounded-lg border border-line bg-surface p-4 text-left">
          <p className="text-sm font-semibold text-ink">{booking.service.title}</p>
          <p className="mt-1 text-xs text-muted">with {booking.technician?.user?.name}</p>
          <p className="mt-2 font-mono text-sm font-bold text-navy">{formatCurrency(booking.service.price)}</p>
        </div>
      )}

      <Link
        href="/dashboard/customer"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-navy px-6 text-sm font-semibold text-paper hover:bg-navy-600"
      >
        View my bookings
      </Link>
    </div>
  );
}
