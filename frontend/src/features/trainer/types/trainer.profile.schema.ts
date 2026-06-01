import { CURRENCY, GENDER, GOVT_ID_TYPE } from '@/constants/constants';
import z from 'zod';

const dayAvailabilitySchema = z
  .object({
    available: z.boolean().default(false),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.available && data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )
  .optional();

const documents = z
  .object({
    name: z.string(),
    url: z.url(),
    validUpto: z.coerce.date(),
    issuedAt: z.coerce.date(),
  })
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); //check for validity of document
      return data.validUpto > today;
    },
    {
      message: 'This document is expired',
      path: ['validUpto'],
    }
  )
  .refine((data) => data.issuedAt <= new Date(), {
    //check for incorrect date
    message: 'Issue date cannot be in the future',
    path: ['issuedAt'],
  });

export const AddTrainerProfileSchema = z.object({
  // --- Basic Info ---
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  coreDiscipline: z.string().min(1, 'Main discipline is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters').max(500),
  profilePic: z.url('Invalid profile picture URL'),
  //professionalInfo
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  certificationInfo: z.object({
    documents: z.array(documents),
  }),

  // Personal Info
  personalInfo: z.object({
    fullName: z.string().min(3, 'full name is required'),
    DOB: z.coerce.date(), // Automatically converts date strings to Date objects
    gender: z.enum(GENDER),
    phone: z.string().min(10, 'invalid phone number'),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
      })
      .optional(),
  }),

  // ID Verification Info
  idVerification: z.object({
    idType: z.enum(GOVT_ID_TYPE),
    idNumber: z.string().min(1, 'ID Number is required'),
    idAttachment: z.url('Invalid ID attachment URL'),
  }),
  // Location
  currentLocation: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.array(z.number()).length(2), // [lat, long]
    })
    .optional(),

  pricing: z.object({
    sessionCharge: z.coerce
      .number()
      .min(1, 'Price must be at least 1')
      .max(10000, 'Price seems too high'),
    currency: z.string().default(CURRENCY.INR),
  }),
  // Availability
  availability: z.object({
    isAvailable: z.boolean().default(true),
    Monday: dayAvailabilitySchema,
    Tuesday: dayAvailabilitySchema,
    Wednesday: dayAvailabilitySchema,
    Thursday: dayAvailabilitySchema,
    Friday: dayAvailabilitySchema,
    Saturday: dayAvailabilitySchema,
    Sunday: dayAvailabilitySchema,
  }),

  // Payment Info (Optional during initial creation depending on your flow)
  paymentInfo: z
    .object({
      bankAccount: z
        .object({
          accountName: z.string().optional(),
          accountNumber: z.string().optional(),
          bankName: z.string().optional(),
          ifscCode: z.string().optional(),
        })
        .optional(),
      upiId: z.string().optional(),
    })
    .optional(),
});
export type AddTrainerProfileData = z.infer<typeof AddTrainerProfileSchema>;
