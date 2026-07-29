'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn, initials } from '@/lib/utils';

const dashboardPath: Record<string, string> = {
  CUSTOMER: '/dashboard/customer',
  TECHNICIAN: '/dashboard/technician',
  ADMIN: '/dashboard/admin',
};

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Browse services' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-amber">
            <Wrench className="h-4 w-4" />
          </span>
          FixItNow
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium text-muted transition-colors hover:text-ink',
                pathname === link.href && 'text-ink'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={dashboardPath[user.role]}
                className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-black/5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-amber">
                  {initials(user.name)}
                </span>
                {user.name.split(' ')[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/auth/register')}>
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="py-1 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={dashboardPath[user.role]} className="py-1 text-sm font-medium text-ink" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/auth/login')}>
                  Log in
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => router.push('/auth/register')}>
                  Get started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
