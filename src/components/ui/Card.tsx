import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-lg border border-line bg-surface shadow-sm', className)}>
      {children}
    </div>
  );
}
