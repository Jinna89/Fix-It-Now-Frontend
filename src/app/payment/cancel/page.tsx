'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelContent />
    </Suspense>
  );
}

function PaymentCancelContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const status = params.get('status');

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-status-declined/10 text-status-declined">
        <XCircle className="h-9 w-9" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">
        {status === 'fail' ? 'Payment failed' : 'Payment cancelled'}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        No charge was made. Your booking is still <span className="font-semibold text-ink">ACCEPTED</span> —
        you can try paying again any time.
      </p>

      <div className="mt-8 flex gap-3">
        {bookingId && (
          <Link
            href={`/dashboard/customer/bookings/${bookingId}/pay`}
            className="inline-flex h-11 items-center rounded-md bg-navy px-6 text-sm font-semibold text-paper hover:bg-navy-600"
          >
            Try again
          </Link>
        )}
        <Link
          href="/dashboard/customer"
          className="inline-flex h-11 items-center rounded-md border border-line px-6 text-sm font-semibold text-ink hover:bg-black/5"
        >
          Back to bookings
        </Link>
      </div>
    </div>
  );
}
