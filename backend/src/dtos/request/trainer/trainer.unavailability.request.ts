import { z } from 'zod';

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s; // rejects 2026-02-31
  }, 'Invalid date');

export const CancelAvailabilitySchema = z.object({
  date: dateString,
  reason: z.string().trim().max(300).optional(),
});
export type CancelAvailabilityDto = z.infer<typeof CancelAvailabilitySchema>;