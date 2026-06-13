import { GENDER, RELATIONSHIP } from '@/constants/constants';
import z from 'zod';

export const DOBSchema = z.coerce
  .date('Date of birth is required')
  .min(new Date('1900-01-01'), 'Please enter a more recent date')
  .max(new Date(), 'Date of birth cannot be in the future');

const phoneRegex = new RegExp(/^([+]?[\s0-9]{1,4})?[\s0-9]{7,15}$/);

export const CreateProfileSchema = z
  .object({
    userId: z.string(),
    fullName: z.string('Enter full Name').min(3, 'Atleast three characters'),
    DOB: DOBSchema,
    gender: z.enum(GENDER),
    phone: z
      .string()
      .regex(phoneRegex, { message: 'Invalid phone number format' })
      .min(10, { message: 'Phone number is too short' })
      .max(15, { message: 'Phone number is too long' }),
      
    relationship: z.enum(RELATIONSHIP),
    street: z.string("Address required"),
    city: z.string("city required").optional(),
    zip: z
      .string()
      .regex(/^[0-9]{5,6}$/, { message: 'Invalid zip code' })
      .optional()
      .or(z.literal('')),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
    profilePic: z.string(),
    isPrimary: z.boolean(),
  })
  .refine(
    (data) => {
      const today = new Date();
      const age = today.getFullYear() - data.DOB.getFullYear();
      return age >= 18;
    },
    {
      message: 'Primary account holder must be at least 18 years old',
      path: ['DOB'],
    }
  );
export type CreateProfileData = z.infer<typeof CreateProfileSchema>;
