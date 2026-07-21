import { z } from 'zod';
import { AGE_GROUP, SESSION_TYPE, DAY, SESSION_MODE, GENDER, INTENSITY_LEVEL } from '@/constants/enums';

const VenueSchema = z.object({
  name: z.string().optional().default(''),
  address: z.string().optional().default(''),
  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
    })
    .optional()
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
export const fitnessSessionSchema = z
  .object({
    trainerId: z.string().min(1, 'Trainer ID is required'),
    fitnessCategory: z.string().min(1, 'Fitness category is required'),
    sessionName: z.string().min(3, 'Session name must be at least 3 characters'),
    slug: z.string(),
    description: z.string().min(10, 'Description should be more detailed'),
    duration: z.number().min(30, 'Duration is required'),
    ageGroup: z.enum(AGE_GROUP),
    gender: z.enum(GENDER).default(GENDER.ALL),
    sessionType: z.enum(SESSION_TYPE),
    maxCapacity: z.number().int().min(1, 'Capacity must be at least 1'),
    enrolledCount: z.number().int().default(0),
    intensityLevel: z.enum(INTENSITY_LEVEL),
    images: z.array(z.string('image required')).optional().default([]),
    mode: z.enum(SESSION_MODE),
    meetingLink: z.string().url('Invalid meeting URL').optional().or(z.literal('')),
    venue: VenueSchema.optional(),
    requirements: z.array(z.string()).optional().default([]),
    pricing: z.array(PricingSchema).min(1, 'At least one pricing plan is required'),
    timeSlots: z.array(TimeSlotSchema).min(1, 'At least one time slot is required'),
    amenities: z.array(z.string()).optional().default([]),
    cancellationPolicy: z.string().min(10, 'Policy briefing is too short').max(500, 'Policy briefing is too long').default('Full refund available if cancelled at least 24 hours before start time.'),
    cancellationWindow: z.number().min(0, 'Window cannot be negative').default(24),
    bookingDeadline: z.number().min(0, 'Deadline cannot be negative').max(72, 'Deadline cannot exceed 3 days').default(2),
  })
  .superRefine((data, ctx) => {
    // offline → venue required
    if (data.mode === SESSION_MODE.OFFLINE) {
      if (!data.venue?.name) {
        ctx.addIssue({ code: 'custom', message: 'Venue name is required for offline sessions', path: ['venue', 'name'] });
      }
      if (!data.venue?.address) {
        ctx.addIssue({ code: 'custom', message: 'Address is required for offline sessions', path: ['venue', 'address'] });
      }
      if (!data.venue?.location?.coordinates) {
        ctx.addIssue({ code: 'custom', message: 'Location is required for offline sessions', path: ['venue', 'location'] });
      }
    }

    // online → meetingLink required
    if (data.mode === SESSION_MODE.ONLINE) {
      if (!data.meetingLink) {
        ctx.addIssue({ code: 'custom', message: 'Meeting link is required for online sessions', path: ['meetingLink'] });
      }
    }

    // cancellation window check
    if (data.cancellationWindow >= data.bookingDeadline) {
      ctx.addIssue({ code: 'custom', message: 'Cancellation window must be less than  booking deadline', path: ['cancellationWindow'] });
    }
  });

export type FitnessSessionInput = z.infer<typeof fitnessSessionSchema>;
