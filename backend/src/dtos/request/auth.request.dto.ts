import { z } from 'zod';
import { OtpType } from '@/constants/enums';
import { UserRole } from '@/constants/enums';

// RegisterRequestDTO
export const RegisterSchema = z.object({
  name: z.string().min(3, 'please provide a proper name'),
  email: z.email('invalid email.format').min(1, 'Email is required').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  role: z.enum(UserRole),
  timezone:z.string(),
});
export type RegisterRequestDTO = z.infer<typeof RegisterSchema>;

//verifyEmailDTO
export const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must only contain numbers'), // Ensures it's a numeric string
});
export type VerifyEmailDTO = z.infer<typeof VerifyEmailSchema>;

//verify OTP DTO
export const VerifyOtpSchema = z.object({
  userId: z.string(),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must only contain numbers'),
  otpContext: z.enum(OtpType),
});
export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;

//resetPassword DTO
export const ResetPasswordSchema = z.object({
  email: z.email(),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must only contain numbers'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

//LoginDTO:
export const LoginSchema = z.object({
  email: z.email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  timezone:z.string(),
});
export type LoginDTO = z.infer<typeof LoginSchema>;

//updateRoleDTO
export const updateRoleSchema = z.object({
  email: z.email(),
  role: z.enum(UserRole),
});
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
