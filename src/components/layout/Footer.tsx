import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-navy text-navy-100">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-navy-900">
              <Wrench className="h-4 w-4" />
            </span>
            FixItNow
          </div>
          <p className="mt-3 max-w-xs text-sm text-navy-100/70">
            Vetted technicians, transparent pricing, and job tickets you can track from request to completion.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber">For customers</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-paper">Browse services</Link></li>
            <li><Link href="/auth/register" className="hover:text-paper">Book a technician</Link></li>
            <li><Link href="/dashboard/customer" className="hover:text-paper">Track a booking</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber">For technicians</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/auth/register" className="hover:text-paper">Join as a pro</Link></li>
            <li><Link href="/dashboard/technician" className="hover:text-paper">Manage availability</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-400 py-4 text-center text-xs text-navy-100/60">
        © {new Date().getFullYear()} FixItNow. Built for the FixItNow backend API.
      </div>
    </footer>
  );
}
