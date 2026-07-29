import { z } from 'zod';

export const profileSchema = z.object({
  bio: z.string().max(1000, 'Keep your bio under 1000 characters').optional().or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
  experienceYears: z.coerce.number().int().min(0, 'Cannot be negative').optional(),
  hourlyRate: z.coerce.number().min(0, 'Cannot be negative').optional(),
  location: z.string().max(150).optional().or(z.literal('')),
  isAvailable: z.boolean().optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const serviceFormSchema = z.object({
  categoryId: z.string().uuid('Choose a category'),
  title: z.string().min(2, 'Title is required').max(150),
  description: z.string().max(1000).optional().or(z.literal('')),
  price: z.coerce.number().positive('Price must be greater than 0'),
  durationMins: z.coerce.number().int().positive('Duration must be positive').optional(),
  location: z.string().max(150).optional().or(z.literal('')),
});
export type ServiceFormInput = z.infer<typeof serviceFormSchema>;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const slotSchema = z
  .object({
    date: z.string().min(1, 'Choose a date'),
    startTime: z.string().regex(timeRegex, 'Use HH:mm, e.g. 09:00'),
    endTime: z.string().regex(timeRegex, 'Use HH:mm, e.g. 11:00'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });
export type SlotInput = z.infer<typeof slotSchema>;
