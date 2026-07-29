import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/lib/types';

const CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  REQUESTED: { label: 'Requested', className: 'bg-status-requested/10 text-status-requested border-status-requested/30' },
  ACCEPTED: { label: 'Accepted', className: 'bg-status-accepted/10 text-status-accepted border-status-accepted/30' },
  DECLINED: { label: 'Declined', className: 'bg-status-declined/10 text-status-declined border-status-declined/30' },
  PAID: { label: 'Paid', className: 'bg-status-paid/10 text-status-paid border-status-paid/30' },
  IN_PROGRESS: { label: 'In progress', className: 'bg-status-progress/10 text-status-progress border-status-progress/30' },
  COMPLETED: { label: 'Completed', className: 'bg-status-completed/10 text-status-completed border-status-completed/30' },
  CANCELLED: { label: 'Cancelled', className: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/30' },
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide',
        cfg.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}
