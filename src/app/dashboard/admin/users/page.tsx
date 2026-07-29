'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, ShieldBan, ShieldCheck } from 'lucide-react';
import { getAllUsers, updateUserStatus } from '@/lib/api/admin';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ApiClientError } from '@/lib/api/client';
import { formatDate, initials } from '@/lib/utils';
import type { Role, UserStatus } from '@/lib/types';

export default function AdminUsersPage() {
  const [role, setRole] = useState<Role | ''>('');
  const [status, setStatus] = useState<UserStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['admin-users', role, status, page],
    queryFn: () => getAllUsers({ role: role || undefined, status: status || undefined, page, limit: 10 }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) => updateUserStatus(id, status),
    onSuccess: (_data, vars) => {
      toast.success(vars.status === 'BANNED' ? 'User banned.' : 'User unbanned.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update user.');
    },
  });

  const users = (usersQuery.data?.data || []).filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const meta = usersQuery.data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">User management</h1>
      <p className="mt-1 text-sm text-muted">Search, filter, and moderate every account on the platform.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input placeholder="Search by name or email" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select className="w-40" value={role} onChange={(e) => { setRole(e.target.value as Role | ''); setPage(1); }}>
          <option value="">All roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="TECHNICIAN">Technician</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Select className="w-40" value={status} onChange={(e) => { setStatus(e.target.value as UserStatus | ''); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BANNED">Banned</option>
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {usersQuery.isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Loading&hellip;
                </td>
              </tr>
            )}
            {usersQuery.isSuccess && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No users match your filters.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-amber">
                      {initials(u.name)}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{u.name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.status === 'ACTIVE' ? 'bg-status-progress/10 text-status-progress' : 'bg-status-declined/10 text-status-declined'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  {u.role !== 'ADMIN' && (
                    <Button
                      size="sm"
                      variant={u.status === 'ACTIVE' ? 'danger' : 'secondary'}
                      isLoading={mutation.isPending && mutation.variables?.id === u.id}
                      onClick={() =>
                        mutation.mutate({ id: u.id, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' })
                      }
                    >
                      {u.status === 'ACTIVE' ? (
                        <>
                          <ShieldBan className="h-3.5 w-3.5" /> Ban
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" /> Unban
                        </>
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-line px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-xs text-muted">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-line px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
