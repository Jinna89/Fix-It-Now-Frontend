import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container-page py-10">
      <Skeleton className="h-8 w-56" />
      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <Skeleton className="h-96 w-full lg:w-64" />
        <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
