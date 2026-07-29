'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  UserCog,
  ClipboardList,
  Users,
  Tags,
  Wrench,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

const NAV: Record<Role, { href: string; label: string; icon: any }[]> = {
  CUSTOMER: [
    { href: '/dashboard/customer', label: 'Overview & bookings', icon: LayoutDashboard },
  ],
  TECHNICIAN: [
    { href: '/dashboard/technician', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/technician/bookings', label: 'Bookings', icon: ClipboardList },
    { href: '/dashboard/technician/availability', label: 'Availability', icon: CalendarDays },
    { href: '/dashboard/technician/profile', label: 'Profile & services', icon: UserCog },
  ],
  ADMIN: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/categories', label: 'Categories', icon: Tags },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return <div className="container-page py-16 text-center text-sm text-muted">Loading your dashboard&hellip;</div>;
  }

  if (!user) {
    return (
      <div className="container-page py-16 text-center text-sm text-muted">
        Please log in to view your dashboard.
      </div>
    );
  }

  const navItems = NAV[user.role];

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="mb-4 flex items-center gap-2 rounded-md bg-navy px-3 py-2 text-paper">
          <Wrench className="h-4 w-4 text-amber" />
          <div>
            <p className="text-xs font-semibold">{user.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-amber">{user.role}</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-navy text-paper' : 'text-muted hover:bg-black/5 hover:text-ink'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
