import { GENDER, GOVT_ID_TYPE, TRAINER_CATEGORY, TRAINER_STATUS } from '@/constants/enums';
import z from 'zod';

const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

const daySchema = z.object({
  available: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const AvailabilityPricingSchema = z.object({
  pricing: z.object({
    sessionCharge: z.number(),
  }),

  availability: z
    .object({
      isAvailable: z.boolean().default(true),

      Monday: daySchema,
      Tuesday: daySchema,
      Wednesday: daySchema,
      Thursday: daySchema,
      Friday: daySchema,
      Saturday: daySchema,
      Sunday: daySchema,
      timezone:z.string(),
      effectiveFrom: z.coerce.date().optional(),
      effectiveTo: z.coerce.date().optional(),
    })
  
    .refine(
      (data) =>
        !data.effectiveTo ||
        !data.effectiveFrom ||
        data.effectiveTo > data.effectiveFrom,
      {
        message: 'End date must be greater than start date',
        path: ['effectiveTo'],
      }
    ),
});
export type AvailabiltyPricingReqDTO = z.infer<typeof AvailabilityPricingSchema>;
export type AvailabilityShape= z.infer<typeof AvailabilityPricingSchema>['availability'];

export const PaymentInfoSchema = z.object({
  paymentInfo: z.object({
    bankAccount: z.object({
      accountName: z.string().min(1, 'Account holder name is required'),
      accountNumber: z.string().min(1, 'Account number is required'),
      bankName: z.string().min(1, 'Bank name is required'),
      ifscCode: z.string().min(1, 'IFSC code is required'),
    }),
    upiId: z.string().optional(),
  }),
});
export type PaymentInfoReqDTO = z.infer<typeof PaymentInfoSchema>;

export const IdVerificationSchema = z.object({
  idType: z.enum(GOVT_ID_TYPE),
  idNumber: z.string().min(1, 'ID Number is required'),
  idAttachment: z.string(),
});
export type idVerificationReqDTO = z.infer<typeof IdVerificationSchema>;


const dayAvailabilitySchema = z.object({
  available: z.boolean().default(false),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const DocumentsInfoSchema = z
  .object({
    name: z.string(),
    url: z.string(),
    validUpto: z.coerce.date(),
    issuedAt: z.coerce.date(),
  })
  .refine(
    (data) => {
      //check for validity of document
      return data.validUpto > new Date();
    },
    {
      message: 'This document is expired',
      path: ['validUpto'],
    }
  );
export const CertificatesSchema = z.object({
  documents: z.array(DocumentsInfoSchema),
});
export type CertificationReqDTO = z.infer<typeof CertificatesSchema>;

export const AddTrainerProfileSchema = z.object({
  // --- Basic Info ---
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  category: z.enum(TRAINER_CATEGORY),
  coreDiscipline: z.string().min(1, 'Main discipline is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters').max(500),
  profilePic: z.url(),
  //professionalInfo
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  certificationInfo: z.object({
    documents: z.array(DocumentsInfoSchema),
  }),

  // Personal Info
  personalInfo: z.object({
    fullName: z.string().min(3),
    DOB: z.coerce.date(), // Automatically converts date strings to Date objects
    gender: z.enum(GENDER),
    phone: z.string().min(10),
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
    idAttachment: z.url(),
  }),
  // Location
  currentLocation: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.array(z.number()).length(2), // [lng, lat]
    })
    .optional(),

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
    timezone:z.string(),
    effectiveFrom: z.coerce.date({
      message: 'Effective start date is required',  
    }),
    effectiveTo: z.coerce.date({
      message: 'Effective end date is required', 
    }),
  })
  .refine((data) => data.effectiveFrom > endOfToday, {
    message: 'Start date cannot be in the past',
    path: ['effectiveFrom'],
  })
  .refine((data) => data.effectiveTo > data.effectiveFrom, {
    message: 'End date must be greater than start date',
    path: ['effectiveTo'],
  }),
  
  pricing: z.object({
    sessionCharge: z.coerce.number().min(1, 'Price must be at least 1').max(10000, 'Price seems too high'),
  }),

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
  status: z.enum(TRAINER_STATUS),
  verificationRemarks: z.object({
    fields: z.array(z.string()), // which fields changed
    changedAt: z.coerce.date(),
  }),
  applicationCount: z.number(),
  penalty: z.number(),
  strikePoints: z.number(),
  cancellationCount: z.number(),
  isDeleted: z.boolean(),
});
export type AddTrainerProfileDTO = z.infer<typeof AddTrainerProfileSchema>;

export const BasicInfoSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  category: z.enum(TRAINER_CATEGORY),
  coreDiscipline: z.string().min(1, 'Main discipline is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters').max(500),
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
});
export type BasicInfoReqDTO = z.infer<typeof BasicInfoSchema>;

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(3),
  DOB: z.coerce.date(), // Automatically converts date strings to Date objects
  gender: z.enum(GENDER),
  phone: z.string().min(10),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});

export type PersonalInfoReqDTO = z.infer<typeof PersonalInfoSchema>;

export interface stripeData{
    stripeAccountId?: string
    stripeOnboardingComplete?: boolean,
}