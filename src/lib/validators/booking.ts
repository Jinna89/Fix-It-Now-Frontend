import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  availabilityId: z.string().uuid().optional(),
  scheduledAt: z.string().min(1, 'Pick an available time slot'),
  notes: z.string().max(500, 'Keep notes under 500 characters').optional().or(z.literal('')),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const reviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.coerce.number().int().min(1, 'Choose a star rating').max(5),
  comment: z.string().max(1000, 'Keep reviews under 1000 characters').optional().or(z.literal('')),
});
export type ReviewInput = z.infer<typeof reviewSchema>;
