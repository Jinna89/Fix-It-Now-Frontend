import { apiFetch, apiFetchWithMeta, buildQuery } from "./client";

import type {
  Category,
  Service,
  TechnicianProfile,
  ServiceFilters,
  TechnicianFilters,
} from "@/lib/types";

export function getServices(filters: ServiceFilters = {}) {
  return apiFetchWithMeta<Service[]>(
    `/services${buildQuery(filters)}`,
    { auth: false }
  );
}

export function getTechnicians(filters: TechnicianFilters = {}) {
  return apiFetchWithMeta<TechnicianProfile[]>(
    `/technicians${buildQuery(filters)}`,
    { auth: false }
  );
}

export function getTechnicianById(id: string) {
  return apiFetch<TechnicianProfile>(
    `/technicians/${id}`,
    { auth: false }
  );
}

export function getCategories() {
  return apiFetch<Category[]>(
    "/categories",
    { auth: false }
  );
}