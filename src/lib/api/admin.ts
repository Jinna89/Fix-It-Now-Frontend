import { apiFetchWithMeta, apiFetch, buildQuery } from './client';
import type { Booking, BookingStatus, Category, User, UserStatus } from '@/lib/types';

export function getAllUsers(filters: { role?: string; status?: string; page?: number; limit?: number } = {}) {
  return apiFetchWithMeta<User[]>(`/admin/users${buildQuery(filters)}`);
}

export function updateUserStatus(id: string, status: UserStatus) {
  return apiFetch<User>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export function getAllBookings(filters: { status?: BookingStatus; page?: number; limit?: number } = {}) {
  return apiFetchWithMeta<Booking[]>(`/admin/bookings${buildQuery(filters)}`);
}

export function getAdminCategories() {
  return apiFetch<Category[]>('/admin/categories');
}

export function createCategory(payload: { name: string; description?: string }) {
  return apiFetch<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(payload) });
}
