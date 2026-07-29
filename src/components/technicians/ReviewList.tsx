import type { Review } from '@/lib/types';
import { Stars } from '@/components/ui/Stars';
import { formatDate, initials } from '@/lib/utils';

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-surface p-6 text-center text-sm text-muted">
        No reviews yet. Be the first customer to leave one after a completed job.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-lg border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-amber">
                {initials(review.customer?.name || 'C')}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{review.customer?.name || 'Customer'}</p>
                <p className="text-xs text-muted">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <Stars rating={review.rating} />
          </div>
          {review.comment && <p className="mt-3 text-sm text-muted">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
