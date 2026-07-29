'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyTechnicianProfile } from '@/lib/api/technician';
import { ProfileForm } from '@/components/technician/ProfileForm';
import { ServicesManager } from '@/components/technician/ServicesManager';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TechnicianProfilePage() {
  const profileQuery = useQuery({
    queryKey: ['technician-profile'],
    queryFn: getMyTechnicianProfile,
    retry: false,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Profile & services</h1>
      <p className="mt-1 text-sm text-muted">Keep your bio, skills, pricing, and service list up to date.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {profileQuery.isLoading ? (
          <>
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </>
        ) : (
          <>
            <ProfileForm profile={profileQuery.data || null} />
            <ServicesManager services={profileQuery.data?.services || []} />
          </>
        )}
      </div>
    </div>
  );
}
