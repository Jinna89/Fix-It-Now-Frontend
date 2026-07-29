import { AvailabilityScheduler } from '@/components/technician/AvailabilityScheduler';

export default function TechnicianAvailabilityPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Availability</h1>
      <p className="mt-1 text-sm text-muted">
        Block out time you&rsquo;re free to work — customers can only book slots you&rsquo;ve added here.
      </p>
      <div className="mt-6">
        <AvailabilityScheduler />
      </div>
    </div>
  );
}
