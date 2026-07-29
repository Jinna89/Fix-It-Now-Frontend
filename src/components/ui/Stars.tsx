import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Stars({ rating, size = 14, className }: { rating: number | string; className?: string; size?: number }) {
  const value = typeof rating === 'string' ? parseFloat(rating) : rating;
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i <= Math.round(value || 0) ? 'fill-amber text-amber' : 'fill-transparent text-line'}
        />
      ))}
    </span>
  );
}
