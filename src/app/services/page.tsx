'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import {
  getCategories,
  getServices,
  getTechnicians,
} from "@/lib/api/services";

import type { ServiceFilters as Filters } from "@/lib/types";
import { ServiceFilters } from '@/components/services/ServiceFilters';
import { ServiceCard } from '@/components/services/ServiceCard';
import { TechnicianCard } from '@/components/technicians/TechnicianCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const [tab, setTab] = useState<'services' | 'technicians'>('services');
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 12 });

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const servicesQuery = useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
    enabled: tab === 'services',
  });

  const techniciansQuery = useQuery({
    queryKey: [
      'technicians',
      filters.location,
      filters.minRating,
      filters.page,
      filters.limit,
    ],
    queryFn: () =>
      getTechnicians({
        location: filters.location,
        minRating: filters.minRating,
        page: filters.page,
        limit: filters.limit,
      }),
    enabled: tab === 'technicians',
  });

  const activeQuery = tab === 'services' ? servicesQuery : techniciansQuery;

  return (
    <div className="container-page py-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-amber-600">Marketplace</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">Browse services & technicians</h1>
      </div>

      <div className="mt-6 inline-flex rounded-md border border-line bg-surface p-1">
        {(['services', 'technicians'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'rounded-sm px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              tab === t ? 'bg-navy text-paper' : 'text-muted hover:text-ink'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <ServiceFilters
          categories={categoriesQuery.data || []}
          value={filters}
          onChange={setFilters}
        />

        <div className="flex-1">
          {activeQuery.isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          )}

          {activeQuery.isError && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-status-declined/40 bg-status-declined/5 p-10 text-center">
              <AlertCircle className="h-6 w-6 text-status-declined" />
              <p className="text-sm text-status-declined">
                {(activeQuery.error as Error)?.message || 'Could not load results.'}
              </p>
            </div>
          )}

          {activeQuery.isSuccess && (activeQuery.data as any).data.length === 0 && (
            <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-sm text-muted">
              No results match your filters. Try widening your search.
            </div>
          )}

          {activeQuery.isSuccess && tab === 'services' && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(servicesQuery.data?.data || []).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {activeQuery.isSuccess && tab === 'technicians' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {(techniciansQuery.data?.data || []).map((tech) => (
                <TechnicianCard key={tech.id} technician={tech} />
              ))}
            </div>
          )}

          {activeQuery.isSuccess && (activeQuery.data as any).meta?.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={(filters.page || 1) <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
                className="rounded-md border border-line px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="font-mono text-xs text-muted">
                Page {(activeQuery.data as any).meta.page} of {(activeQuery.data as any).meta.totalPages}
              </span>
              <button
                disabled={(activeQuery.data as any).meta.page >= (activeQuery.data as any).meta.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                className="rounded-md border border-line px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
