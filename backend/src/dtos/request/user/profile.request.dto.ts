import { GENDER, RELATIONSHIP } from '@/constants/enums';

import z from 'zod';

const phoneRegex = new RegExp(/^([+]?[\s0-9]{1,4})?[\s0-9]{7,15}$/);

export const CreateUserProfileSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  DOB: z.coerce.date(),
  gender: z.enum(GENDER),
  phone: z.string().min(10, { message: 'Phone number is too short' }).max(15, { message: 'Phone number is too long' }).regex(phoneRegex, { message: 'Invalid phone number format' }),
  relationship: z.enum(RELATIONSHIP),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  profilePic: z.string(),
  isPrimary: z.boolean(),
});
export type CreateUserProfileDTO = z.infer<typeof CreateUserProfileSchema>;
