'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock } from 'lucide-react';
import { getBookingById } from '@/lib/api/bookings';
import { createPayment } from '@/lib/api/payments';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ApiClientError } from '@/lib/api/client';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function PayBookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const bookingQuery = useQuery({
    queryKey: ['booking', params.id],
    queryFn: () => getBookingById(params.id),
  });

  const mutation = useMutation({
    mutationFn: () => createPayment(params.id),
    onSuccess: (data) => {
      setRedirecting(true);
      toast.success('Redirecting to SSLCommerz checkout&hellip;');
      window.location.href = data.gatewayPageURL;
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not start payment.');
    },
  });

  if (bookingQuery.isLoading) {
    return (
      <div className="container-page max-w-lg py-12">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (bookingQuery.isError || !bookingQuery.data) {
    return (
      <div className="container-page max-w-lg py-12 text-center text-sm text-status-declined">
        Could not load this booking.
      </div>
    );
  }

  const booking = bookingQuery.data;

  if (booking.status !== 'ACCEPTED') {
    return (
      <div className="container-page max-w-lg py-12 text-center">
        <p className="text-sm text-muted">
          This booking is <StatusBadge status={booking.status} className="mx-1" /> and isn&rsquo;t awaiting payment.
        </p>
        <Button className="mt-4" variant="outline" onClick={() => router.push('/dashboard/customer')}>
          Back to bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page flex max-w-lg flex-col items-center py-12">
      <div className="w-full rounded-lg border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-status-accepted">
          <ShieldCheck className="h-4 w-4" /> Ready for payment
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">{booking.service?.title}</h1>
        <p className="mt-1 text-sm text-muted">with {booking.technician?.user?.name}</p>

        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Scheduled</dt>
            <dd className="font-medium text-ink">{formatDateTime(booking.scheduledAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Amount due</dt>
            <dd className="font-mono text-lg font-bold text-navy">{formatCurrency(booking.service?.price ?? 0)}</dd>
          </div>
        </dl>

        <Button
          className="mt-6 w-full"
          isLoading={mutation.isPending || redirecting}
          onClick={() => mutation.mutate()}
        >
          <Lock className="h-4 w-4" /> Pay with SSLCommerz
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          You&rsquo;ll be redirected to SSLCommerz&rsquo;s secure checkout to complete payment.
        </p>
      </div>
    </div>
  );
}
