import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Briefcase, MapPin } from 'lucide-react';
import { Stars } from '@/components/ui/Stars';
import { ReviewList } from '@/components/technicians/ReviewList';
import { BookingForm } from '@/components/technicians/BookingForm';
import { formatCurrency } from '@/lib/utils';
import type { TechnicianProfile } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

async function getTechnician(id: string): Promise<TechnicianProfile | null> {
  try {
    const res = await fetch(`${API_URL}/technicians/${id}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    const json = await res.json();
    if (!json?.success) return null;
    return json.data as TechnicianProfile;
  } catch {
    return null;
  }
}

export default async function TechnicianProfilePage({ params }: { params: { id: string } }) {
  const technician = await getTechnician(params.id);
  if (!technician) notFound();

  const seed = encodeURIComponent(technician.user?.name || technician.id);

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-navy-50">
          <Image src={`https://picsum.photos/seed/${seed}/160/160`} alt={technician.user?.name || 'Technician'} fill sizes="80px" className="object-cover" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{technician.user?.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Stars rating={technician.avgRating} />
              <span className="ml-1">
                {parseFloat(String(technician.avgRating)).toFixed(1)} ({technician.totalReviews} reviews)
              </span>
            </span>
            {technician.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {technician.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {technician.experienceYears} yrs experience
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {technician.bio && (
            <section>
              <h2 className="font-display text-lg font-semibold text-ink">About</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{technician.bio}</p>
            </section>
          )}

          {technician.skills?.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-ink">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {technician.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Services</h2>
            <div className="mt-2 space-y-3">
              {(technician.services || []).map((service) => (
                <div key={service.id} className="flex items-center justify-between rounded-lg border border-line bg-surface p-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{service.title}</p>
                    {service.description && <p className="mt-0.5 text-xs text-muted">{service.description}</p>}
                    <p className="mt-1 text-xs text-muted">{service.durationMins} mins &middot; {service.category?.name}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold text-navy">{formatCurrency(service.price)}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Reviews</h2>
            <div className="mt-3">
              <ReviewList reviews={technician.reviews || []} />
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-20 lg:h-fit">
          <BookingForm
            technicianId={technician.id}
            services={technician.services || []}
            availability={technician.availability || []}
          />
        </div>
      </div>
    </div>
  );
}
