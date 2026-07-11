import { z } from 'zod';
import { OTP_TYPE, ROLES } from '../../../constants/constants';

export const EmailSchema = z
  .email('Invalid email')
  .trim()
  .min(4, 'Email required')  
  .refine(
    (val) => val.split('@')[0].length >= 3,
    'Email must have at least 3 characters before @'
  );
  

export const passwordSchema = z
  .string('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const LoginSchema = z.object({
  email: EmailSchema,
  password: passwordSchema,
  roles: z.array(z.enum(ROLES)),
  activeRole: z.enum(ROLES),
  timezone:z.string()
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes")
  .trim()
  .refine((val) => val.trim().length >= 3, "Name must be at least 3 characters")
  .refine(
    (val) => !/\s{2,}/.test(val),
    "Name cannot contain consecutive spaces"
  ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// 3. Export the clean types
export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export const registerCredentialSchema = LoginSchema.extend({
  name: z.string().min(3, 'Please enter a valid name'),
});
export type registerCredentials = z.infer<typeof registerCredentialSchema>;

export const UpdateRoleSchema = z.object({
  email: z.email(),
  role: z.enum(ROLES),
});
export type UpdateRolData = z.infer<typeof UpdateRoleSchema>;

export const VerifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string(),
});
export type verifyOTPData = z.infer<typeof VerifyOtpSchema>;

export const ResendOtpSchema = z.object({
  email: z.email(),
  otpContext: z.enum(OTP_TYPE),
});
export type ResendOtpData = z.infer<typeof ResendOtpSchema>;

export const ResetPasswordSchema = z.object({
  email: z.email(),
  otp: z.enum(OTP_TYPE),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

// // ------------Validation function----------
// export type ValidationResult<T> =
//   | { success: true; data: T }
//   | { success: false; errors: Record<string, string> };

// export const validateRegisterForm=(data:any):ValidationResult<any>=>{

//       const formData={
//         email: data.email||"",
//         password: data.password||"",
//         confirmPassword: data?.confirmPassword||"",
//         role: data.role||"",
//       }
//       const result=RegisterSchema.safeParse(formData);
//      if (!result.success) {
//         const errors: Record<string, string> = {};
//         result.error.issues.forEach((issue) => {
//           const path = issue.path[0] as string;
//           errors[path] = issue.message;
//         });
//         return { success: false, errors };
//       }
//       return { success: true, data: result.data };
//     }

// export const validateLoginForm=(data:any):ValidationResult<any>=>{

//       const formData={
//         email: data.email||"",
//         password: data.password||"",
//         role: data.role||"",
//       }
//       const result=LoginSchema.safeParse(formData);
//       if (!result.success) {
//         const errors: Record<string, string> = {};
//         result.error.issues.forEach((issue) => {
//           const path = issue.path[0] as string;
//           errors[path] = issue.message;
//         });
//         return { success: false, errors };
//       }
//       return { success: true, data: result.data };

// }
