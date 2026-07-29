import { apiFetch } from './client';
import type { Availability, Booking, BookingStatus, Service, TechnicianProfile } from '@/lib/types';

export function getMyTechnicianProfile() {
  return apiFetch<TechnicianProfile>('/technician/profile');
}

export function updateTechnicianProfile(payload: {
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  hourlyRate?: number;
  location?: string;
  isAvailable?: boolean;
}) {
  return apiFetch<TechnicianProfile>('/technician/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function createTechnicianService(payload: {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
  durationMins?: number;
  location?: string;
}) {
  return apiFetch<Service>('/technician/services', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateTechnicianService(
  id: string,
  payload: Partial<{
    categoryId: string;
    title: string;
    description?: string;
    price: number;
    durationMins?: number;
    location?: string;
    isActive: boolean;
  }>
) {
  return apiFetch<Service>(`/technician/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getMyAvailability() {
  return apiFetch<Availability[]>('/technician/availability');
}

export function updateAvailability(slots: { date: string; startTime: string; endTime: string }[]) {
  return apiFetch<Availability[]>('/technician/availability', {
    method: 'PUT',
    body: JSON.stringify({ slots }),
  });
}

export function getMyTechnicianBookings(status?: BookingStatus) {
  return apiFetch<Booking[]>(`/technician/bookings${status ? `?status=${status}` : ''}`);
}

export function updateBookingStatus(id: string, status: BookingStatus, cancelReason?: string) {
  return apiFetch<Booking>(`/technician/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, cancelReason }),
  });
}
