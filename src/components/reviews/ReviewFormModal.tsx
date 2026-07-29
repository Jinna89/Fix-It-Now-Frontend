'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { reviewSchema, type ReviewInput } from '@/lib/validators/booking';
import { createReview } from '@/lib/api/reviews';
import { ApiClientError } from '@/lib/api/client';
import { cn } from '@/lib/utils';

export function ReviewFormModal({
  bookingId,
  open,
  onClose,
}: {
  bookingId: string;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { bookingId, rating: 0, comment: '' },
  });

  const rating = watch('rating');

  const mutation = useMutation({
    mutationFn: (values: ReviewInput) => createReview(values),
    onSuccess: () => {
      toast.success('Thanks for your review!');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      reset();
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not submit review.');
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="Leave a review">
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Rating</p>
          <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                type="button"
                key={i}
                onMouseEnter={() => setHovered(i)}
                onClick={() => setValue('rating', i, { shouldValidate: true })}
                aria-label={`${i} star`}
              >
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors',
                    i <= (hovered || rating) ? 'fill-amber text-amber' : 'fill-transparent text-line'
                  )}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="mt-1 text-xs font-medium text-status-declined">{errors.rating.message}</p>}
        </div>

        <Field label="Comment (optional)" error={errors.comment?.message}>
          <Textarea rows={4} placeholder="How did the job go?" {...register('comment')} />
        </Field>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Submit review
        </Button>
      </form>
    </Modal>
  );
}
