import { apiFetch } from './client';
import type { Review } from '@/lib/types';

export function createReview(payload: { bookingId: string; rating: number; comment?: string }) {
  return apiFetch<Review>('/reviews', { method: 'POST', body: JSON.stringify(payload) });
}
