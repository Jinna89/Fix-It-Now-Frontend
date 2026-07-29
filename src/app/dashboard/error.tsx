'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-declined/10 text-status-declined">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h2 className="mt-4 font-display text-xl font-bold text-ink">Couldn&rsquo;t load this dashboard</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {error.message || 'Something went wrong talking to the FixItNow API.'}
      </p>
      <Button className="mt-5" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
