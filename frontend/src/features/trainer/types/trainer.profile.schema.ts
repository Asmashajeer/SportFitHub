import {  DAYS_OF_WEEK, GENDER, GOVT_ID_TYPE } from '@/constants/constants';
import z from 'zod';
const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));
const timeSlotSchema = z
  .object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

const dailyAvailabilitySchema = z.object({
  day: z.enum(DAYS_OF_WEEK),
  isAvailable: z.boolean().default(false),
  slots: z.array(timeSlotSchema),
});



export const DocumentsInfoSchema = z
  .object({
    name: z.string("certificate Name required"),
    url: z.string("certificate Attachment is required"),
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
 
export const DOBSchema = z.coerce
  .date('Date of birth is required')
  .min(new Date('1900-01-01'), 'Please enter a more recent date')
  .max(new Date(), 'Date of birth cannot be in the future');

export const AddTrainerProfileSchema = z.object({
  // --- Basic Info ---
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  coreDiscipline: z.string().min(1, 'Main discipline is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters').max(500),
  profilePic: z.string('profile pic required'),
  //professionalInfo
  specialties: z.array(z.string()),
  experience: z.number().min(0, 'Experience cannot be negative'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  certificationInfo: z.object({
    documents: z.array(DocumentsInfoSchema),
  }),

  // Personal Info
  personalInfo: z.object({
    fullName: z.string().min(3, 'full name is required'),
    DOB:DOBSchema, // Automatically converts date strings to Date objects
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
    idAttachment: z.string('required ID attachment '),
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
  }),
  // Availability
  availability: z.object({
      weeklySchedule: z.array(dailyAvailabilitySchema).min(1, 'Please add at least one available day'),
      timezone: z.string().default('UTC'),
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
        message: 'Availability end date must be greater than availability start date',
        path: ['effectiveTo'],
      }),
  })
.refine(
    (data) => {
      const today = new Date();
      const age = today.getFullYear() - data.personalInfo.DOB.getFullYear();
      return age >= 18;
    },
    {
      message: 'Trainer  must be at least 18 years old',
      path: ['DOB'],
    }
  );;
export type AddTrainerProfileData = z.infer<typeof AddTrainerProfileSchema>;


export const BasicInfoSchema = z.object({
  // --- Basic Info ---
 displayName: z.string().min(3, 'Display name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  coreDiscipline: z.string().min(1, 'Main discipline is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters').max(500),
   specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  languages: z.array(z.string()).min(1, 'Select at least one language')
});
export type basicInfoData = z.infer<typeof BasicInfoSchema>;


  // Personal Info
export const PersonalInfoSchema=z.object({
    fullName: z.string().min(3, 'full name is required'),
    DOB: z.coerce.date(), // Automatically converts date strings to Date objects
    gender: z.enum(GENDER),
    phone: z.string().min(10, 'invalid phone number')
    .refine(val => !/^0+$/.test(val), 'Invalid phone number')        // ← blocks 0000000000
    .refine(val => /^[0-9]+$/.test(val), 'Invalid phone number') ,    // ← only digits
  
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
      })
      .optional(),
  });
export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>;


