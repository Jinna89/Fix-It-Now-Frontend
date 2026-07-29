import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Service } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export function ServiceCard({ service }: { service: Service }) {
  const tech = service.technician;
  const seed = encodeURIComponent(service.title);

  return (
    <Link
      href={tech ? `/technicians/${tech.id}` : '/services'}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-navy-50">
        <Image
          src={`https://picsum.photos/seed/${seed}/480/320`}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-amber">
          {service.category?.name || 'Service'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold text-ink line-clamp-1">{service.title}</h3>
        <p className="mt-1 text-xs text-muted">{tech?.user?.name || 'FixItNow pro'}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-medium text-ink">
            <Star className="h-3.5 w-3.5 fill-amber text-amber" />
            {tech ? parseFloat(String(tech.avgRating)).toFixed(1) : 'New'}
          </span>
          <span className="font-mono text-sm font-semibold text-navy">
            From {formatCurrency(service.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
