'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, CircleDollarSign, Clock3, Star } from 'lucide-react';
import { getMyTechnicianBookings, getMyTechnicianProfile } from '@/lib/api/technician';
import { BookingTicket } from '@/components/bookings/BookingTicket';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';

export default function TechnicianOverviewPage() {
  const profileQuery = useQuery({ queryKey: ['technician-profile'], queryFn: getMyTechnicianProfile, retry: false });
  const bookingsQuery = useQuery({ queryKey: ['technician-bookings'], queryFn: () => getMyTechnicianBookings() });

  const bookings = bookingsQuery.data || [];
  const pending = bookings.filter((b) => b.status === 'REQUESTED');
  const upcoming = bookings.filter((b) => ['ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status));
  const earnings = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + parseFloat(String(b.service?.price ?? 0)), 0);

  const noProfile = profileQuery.isError;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-muted">Your jobs, earnings, and pending requests at a glance.</p>
      </div>

      {noProfile && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-sm text-amber-700">
          You haven&rsquo;t set up your technician profile yet.{' '}
          <Link href="/dashboard/technician/profile" className="font-semibold underline">
            Complete it now
          </Link>{' '}
          to start receiving bookings.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-5">
          <Clock3 className="h-5 w-5 text-status-requested" />
          <p className="mt-3 font-mono text-2xl font-bold text-ink">{pending.length}</p>
          <p className="text-xs text-muted">Pending requests</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5">
          <Briefcase className="h-5 w-5 text-status-accepted" />
          <p className="mt-3 font-mono text-2xl font-bold text-ink">{upcoming.length}</p>
          <p className="text-xs text-muted">Upcoming jobs</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-5">
          <CircleDollarSign className="h-5 w-5 text-status-progress" />
          <p className="mt-3 font-mono text-2xl font-bold text-ink">{formatCurrency(earnings)}</p>
          <p className="text-xs text-muted">Total earnings</p>
        </div>
      </div>

      {profileQuery.data && (
        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface p-4 text-sm">
          <Star className="h-4 w-4 fill-amber text-amber" />
          <span className="font-medium text-ink">{parseFloat(String(profileQuery.data.avgRating)).toFixed(1)} average rating</span>
          <span className="text-muted">from {profileQuery.data.totalReviews} reviews</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Pending requests</h2>
          <Link href="/dashboard/technician/bookings" className="text-sm font-medium text-navy hover:underline">
            View all bookings →
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {bookingsQuery.isLoading && <Skeleton className="h-32 w-full" />}
          {bookingsQuery.isSuccess && pending.length === 0 && (
            <p className="rounded-lg border border-dashed border-line bg-surface p-6 text-center text-sm text-muted">
              No pending requests right now.
            </p>
          )}
          {pending.slice(0, 3).map((booking) => (
            <BookingTicket key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </div>
  );
}
