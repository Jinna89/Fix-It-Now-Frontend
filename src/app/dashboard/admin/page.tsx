'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, Ban, CircleDollarSign, Users2 } from 'lucide-react';
import { getAllBookings, getAllUsers } from '@/lib/api/admin';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminOverviewPage() {
  const usersQuery = useQuery({ queryKey: ['admin-users', 'stats'], queryFn: () => getAllUsers({ limit: 1 }) });
  const bookingsQuery = useQuery({ queryKey: ['admin-bookings'], queryFn: () => getAllBookings({ limit: 10 }) });
  const activeBookingsQuery = useQuery({
    queryKey: ['admin-bookings', 'active'],
    queryFn: () => getAllBookings({ status: 'IN_PROGRESS', limit: 1 }),
  });
  const bannedQuery = useQuery({
    queryKey: ['admin-users', 'banned'],
    queryFn: () => getAllUsers({ status: 'BANNED', limit: 1 }),
  });

  const revenue = (bookingsQuery.data?.data || [])
    .filter((b) => b.payment?.status === 'COMPLETED')
    .reduce((sum, b) => sum + parseFloat(String(b.payment?.amount ?? 0)), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Platform overview</h1>
        <p className="mt-1 text-sm text-muted">Global health across users, bookings, and revenue.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users2} label="Total users" value={usersQuery.data?.meta?.total ?? '—'} loading={usersQuery.isLoading} />
        <StatCard icon={Activity} label="Active bookings" value={activeBookingsQuery.data?.meta?.total ?? '—'} loading={activeBookingsQuery.isLoading} />
        <StatCard icon={CircleDollarSign} label="Revenue (recent)" value={formatCurrency(revenue)} loading={bookingsQuery.isLoading} />
        <StatCard icon={Ban} label="Banned users" value={bannedQuery.data?.meta?.total ?? '—'} loading={bannedQuery.isLoading} />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Recent bookings</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookingsQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted">
                    Loading&hellip;
                  </td>
                </tr>
              )}
              {(bookingsQuery.data?.data || []).map((b) => (
                <tr key={b.id} className="border-t border-line">
                  <td className="px-4 py-3">{b.service?.title}</td>
                  <td className="px-4 py-3">{b.customer?.name}</td>
                  <td className="px-4 py-3">{b.technician?.user?.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: any;
  label: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <Icon className="h-5 w-5 text-amber-600" />
      {loading ? (
        <Skeleton className="mt-3 h-7 w-16" />
      ) : (
        <p className="mt-3 font-mono text-2xl font-bold text-ink">{value}</p>
      )}
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
