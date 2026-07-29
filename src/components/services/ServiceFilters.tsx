'use client';

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Category } from '@/lib/types';
import type { ServiceFilters as Filters } from '@/lib/api/services';

export function ServiceFilters({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local.search !== value.search || local.location !== value.location) {
        onChange({ ...local, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.search, local.location]);

  return (
    <aside className="w-full shrink-0 space-y-5 rounded-lg border border-line bg-surface p-5 lg:w-64">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted">Search</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="e.g. ceiling fan"
            className="pl-9"
            value={local.search || ''}
            onChange={(e) => setLocal((l) => ({ ...l, search: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted">Category</label>
        <Select
          value={local.categoryId || ''}
          onChange={(e) => {
            const next = { ...local, categoryId: e.target.value || undefined, page: 1 };
            setLocal(next);
            onChange(next);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted">Location</label>
        <Input
          placeholder="e.g. Dhaka"
          value={local.location || ''}
          onChange={(e) => setLocal((l) => ({ ...l, location: e.target.value }))}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted">Price range (৳)</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={local.minPrice ?? ''}
            onChange={(e) => setLocal((l) => ({ ...l, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
          />
          <span className="text-muted">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={local.maxPrice ?? ''}
            onChange={(e) => setLocal((l) => ({ ...l, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted">Minimum rating</label>
        <Select
          value={local.minRating ?? ''}
          onChange={(e) => {
            const next = { ...local, minRating: e.target.value ? Number(e.target.value) : undefined, page: 1 };
            setLocal(next);
            onChange(next);
          }}
        >
          <option value="">Any rating</option>
          {[4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r}+ stars
            </option>
          ))}
        </Select>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onChange({ ...local, page: 1 })}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const cleared: Filters = { page: 1, limit: value.limit };
            setLocal(cleared);
            onChange(cleared);
          }}
        >
          Reset
        </Button>
      </div>
    </aside>
  );
}
