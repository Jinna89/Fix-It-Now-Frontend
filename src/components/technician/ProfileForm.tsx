'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { profileSchema, type ProfileInput } from '@/lib/validators/technician';
import { updateTechnicianProfile } from '@/lib/api/technician';
import { ApiClientError } from '@/lib/api/client';
import type { TechnicianProfile } from '@/lib/types';

export function ProfileForm({ profile }: { profile: TechnicianProfile | null }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: profile?.bio || '',
      skills: profile?.skills?.join(', ') || '',
      experienceYears: profile?.experienceYears ?? 0,
      hourlyRate: Number(profile?.hourlyRate ?? 0),
      location: profile?.location || '',
      isAvailable: profile?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || '',
        skills: profile.skills?.join(', ') || '',
        experienceYears: profile.experienceYears,
        hourlyRate: Number(profile.hourlyRate),
        location: profile.location || '',
        isAvailable: profile.isAvailable,
      });
    }
  }, [profile, reset]);

  const isAvailable = watch('isAvailable');

  const mutation = useMutation({
    mutationFn: (values: ProfileInput) =>
      updateTechnicianProfile({
        bio: values.bio || undefined,
        skills: values.skills ? values.skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        experienceYears: values.experienceYears,
        hourlyRate: values.hourlyRate,
        location: values.location || undefined,
        isAvailable: values.isAvailable,
      }),
    onSuccess: () => {
      toast.success('Profile updated.');
      queryClient.invalidateQueries({ queryKey: ['technician-profile'] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiClientError ? err.message : 'Could not update profile.');
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="space-y-4 rounded-lg border border-line bg-surface p-5"
    >
      <h2 className="font-display text-lg font-semibold text-ink">Profile</h2>

      <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
        <Textarea id="bio" rows={4} placeholder="Tell customers about your experience" {...register('bio')} />
      </Field>

      <Field label="Skills (comma-separated)" htmlFor="skills" error={errors.skills?.message}>
        <Input id="skills" placeholder="Wiring, AC repair, Plumbing" {...register('skills')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Experience (years)" htmlFor="experienceYears" error={errors.experienceYears?.message}>
          <Input id="experienceYears" type="number" min={0} {...register('experienceYears')} />
        </Field>
        <Field label="Hourly rate (৳)" htmlFor="hourlyRate" error={errors.hourlyRate?.message}>
          <Input id="hourlyRate" type="number" min={0} step="0.01" {...register('hourlyRate')} />
        </Field>
      </div>

      <Field label="Location" htmlFor="location" error={errors.location?.message}>
        <Input id="location" placeholder="e.g. Gulshan, Dhaka" {...register('location')} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={isAvailable} onChange={(e) => setValue('isAvailable', e.target.checked, { shouldDirty: true })} className="h-4 w-4 rounded border-line" />
        Currently accepting new bookings
      </label>

      <Button type="submit" isLoading={mutation.isPending} disabled={!isDirty}>
        Save profile
      </Button>
    </form>
  );
}
