import Link from 'next/link';
import { ArrowRight, CalendarCheck, ShieldCheck, Wrench } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { TechnicianCard } from '@/components/technicians/TechnicianCard';
import type { Service, TechnicianProfile } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

async function getFeaturedServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services?limit=6`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

async function getTopTechnicians(): Promise<TechnicianProfile[]> {
  try {
    const res = await fetch(`${API_URL}/technicians?limit=3`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [services, technicians] = await Promise.all([getFeaturedServices(), getTopTechnicians()]);

  return (
    <>
      <section className="border-b border-line bg-navy text-paper">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-400 bg-navy-600 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-amber">
              <Wrench className="h-3 w-3" /> Home services, ticketed end-to-end
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Book a technician the way you&rsquo;d book a mechanic &mdash; with a real job ticket.
            </h1>
            <p className="mt-4 max-w-lg text-navy-100/80">
              Compare vetted electricians, plumbers, cleaners and more. Pick an open time slot,
              pay securely, and follow the job from request to completion.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold text-navy-900 hover:bg-amber-600"
              >
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-11 items-center rounded-md border border-navy-400 px-5 text-sm font-semibold text-paper hover:bg-navy-600"
              >
                Join as a technician
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: 'Vetted pros', desc: 'Rated by real customers after every job' },
              { icon: CalendarCheck, label: 'Real time slots', desc: 'See exactly when a technician is free' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-lg border border-navy-400 bg-navy-600 p-5">
                <Icon className="h-6 w-6 text-amber" />
                <p className="mt-3 font-display text-lg font-semibold">{label}</p>
                <p className="mt-1 text-sm text-navy-100/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-amber-600">Featured</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">Popular services near you</h2>
          </div>
          <Link href="/services" className="hidden text-sm font-medium text-navy hover:underline sm:inline-flex">
            View all services →
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
            No services are available yet. Once technicians add services, they&rsquo;ll show up here.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {technicians.length > 0 && (
        <section className="container-page pb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-600">Top rated</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Technicians customers love</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
