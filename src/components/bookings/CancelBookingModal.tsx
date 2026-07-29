'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { cancelBooking } from '@/lib/api/bookings';
import { ApiClientError } from '@/lib/api/client';

export function CancelBookingModal({
  bookingId,
  open,
  onClose,
}: {
  bookingId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => cancelBooking(bookingId, reason || undefined),
    onSuccess: () => {
      toast.success('Booking cancelled.');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not cancel booking.');
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="Cancel this booking?">
      <p className="text-sm text-muted">
        The technician will be notified. This can&rsquo;t be undone.
      </p>
      <Textarea
        rows={3}
        className="mt-3"
        placeholder="Reason (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Keep booking
        </Button>
        <Button variant="danger" isLoading={mutation.isPending} onClick={() => mutation.mutate()}>
          Cancel booking
        </Button>
      </div>
    </Modal>
  );
}
