import { apiFetch, apiFetchWithMeta, buildQuery } from './client';
import type { Category, Service, TechnicianProfile } from '@/lib/types';

export interface ServiceFilters {
  categoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export function getServices(filters: ServiceFilters = {}) {
  return apiFetchWithMeta<Service[]>(`/services${buildQuery(filters)}`, { auth: false });
}

export interface TechnicianFilters {
  location?: string;
  minRating?: number;
  skill?: string;
  page?: number;
  limit?: number;
}

export function getTechnicians(filters: TechnicianFilters = {}) {
  return apiFetchWithMeta<TechnicianProfile[]>(`/technicians${buildQuery(filters)}`, { auth: false });
}

export function getTechnicianById(id: string) {
  return apiFetch<TechnicianProfile>(`/technicians/${id}`, { auth: false });
}

export function getCategories() {
  return apiFetch<Category[]>('/categories', { auth: false });
}
