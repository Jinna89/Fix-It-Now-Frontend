import Image from 'next/image';
import Link from 'next/link';
import type { TechnicianProfile } from '@/lib/types';
import { Stars } from '@/components/ui/Stars';
import { formatCurrency } from '@/lib/utils';

export function TechnicianCard({ technician }: { technician: TechnicianProfile }) {
  const seed = encodeURIComponent(technician.user?.name || technician.id);
  return (
    <Link
      href={`/technicians/${technician.id}`}
      className="group flex items-center gap-4 rounded-lg border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-navy-50">
        <Image src={`https://picsum.photos/seed/${seed}/128/128`} alt={technician.user?.name || 'Technician'} fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-semibold text-ink">{technician.user?.name}</h3>
        <p className="truncate text-xs text-muted">{technician.location || 'Location not set'}</p>
        <div className="mt-1 flex items-center gap-2">
          <Stars rating={technician.avgRating} />
          <span className="text-xs text-muted">({technician.totalReviews})</span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-semibold text-navy">{formatCurrency(technician.hourlyRate)}/hr</p>
      </div>
    </Link>
  );
}
