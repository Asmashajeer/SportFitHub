import { z } from 'zod';
import { AGE_GROUP, SESSION_TYPE, DAY } from '@/constants/enums';

const VenueSchema = z.object({
  name: z.string('Venue name is required '),
  address: z.string('Address is required'),
  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    })
    .default({ type: 'Point', coordinates: [0, 0] }),
});

const SlotObject = z
  .object({
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format'),
  })
  .refine(
    (data) => {
      // Simple check to ensure end is after start
      return data.endTime > data.startTime;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );
const TimeSlotSchema = z.object({
  day: z.enum(DAY),
  slots: z.array(SlotObject).min(1, 'At least one time slot is required for this day'),
});

const PricingSchema = z.object({
  sessionCount: z.number().int().positive('Session count must be positive'),
  price: z.number().nonnegative('Price cannot be negative'),
});

// 2. Main SportsSession Schema
export const sportsSessionSchema = z
  .object({
    trainerId: z.string().min(1, 'Trainer ID is required'),
    sportCategory: z.string().min(1, 'Sport category is required'),
    sessionName: z.string().min(3, 'Session name must be at least 3 characters'),
    slug: z.string(),
    description: z.string().min(10, 'Description should be more detailed'),
    duration: z.number().min(30, 'Duration is required'),
    ageGroup: z.enum(AGE_GROUP),
    sessionType: z.enum(SESSION_TYPE),
    maxCapacity: z.number().int().min(1, 'Capacity must be at least 1'),
    enrolledCount: z.number().int().default(0),
    images: z.array(z.string('add image ')).optional().default([]),

    venue: VenueSchema,
    pricing: z.array(PricingSchema).min(1, 'At least one pricing plan is required'),
    timeSlots: z.array(TimeSlotSchema).min(1, 'At least one time slot is required'),
    amenities: z.array(z.string()).optional().default([]),
    cancellationPolicy: z.string().min(10, 'Policy briefing is too short').max(500, 'Policy briefing is too long').default('Full refund available if cancelled at least 24 hours before start time.'),
    cancellationWindow: z.number().min(0, 'Window cannot be negative').default(24),
    bookingDeadline: z.number().min(0, 'Deadline cannot be negative').max(72, 'Deadline cannot exceed 3 days').default(2),
  })
  .superRefine((data, ctx) => {
    if (!data.venue?.name) {
      ctx.addIssue({ code: 'custom', message: 'Venue name is required ', path: ['venue', 'name'] });
    }
    if (!data.venue?.address) {
      ctx.addIssue({ code: 'custom', message: 'Address is required ', path: ['venue', 'address'] });
    }
    if (!data.venue?.location?.coordinates) {
      ctx.addIssue({ code: 'custom', message: 'Location is required ', path: ['venue', 'location'] });
    }

    // cancellation window check
    if (data.cancellationWindow > data.bookingDeadline) {
      ctx.addIssue({ code: 'custom', message: 'Cancellation window must be < booking deadline', path: ['cancellationWindow'] });
    }
  });

export type SportsSessionInput = z.infer<typeof sportsSessionSchema>;
