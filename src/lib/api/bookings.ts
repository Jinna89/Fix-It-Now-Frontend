import { apiFetch } from './client';
import type { Booking, BookingStatus } from '@/lib/types';

export function createBooking(payload: {
  serviceId: string;
  availabilityId?: string;
  scheduledAt: string;
  notes?: string;
}) {
  return apiFetch<Booking>('/bookings', { method: 'POST', body: JSON.stringify(payload) });
}

export function getMyBookings(status?: BookingStatus) {
  return apiFetch<Booking[]>(`/bookings${status ? `?status=${status}` : ''}`);
}

export function getBookingById(id: string) {
  return apiFetch<Booking>(`/bookings/${id}`);
}

export function cancelBooking(id: string, cancelReason?: string) {
  return apiFetch<Booking>(`/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ cancelReason }),
  });
}
