import { z } from 'zod';
import { OtpType } from '../models/otp.model';
import { UserRole } from '../models/user.model';

// RegisterDTO: Logic for creating a new account
export const RegisterSchema = z.object({ 
  email: z.email("invalid email.format")
    .min(1, "Email is required")    
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),  

  role:z.enum(UserRole)
});
export type RegisterDTO = z.infer<typeof RegisterSchema>;



//BaseResponseDto: Standardized API response structure 
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  statusCode: z.number(),    
});
export type BaseResponseDTO = z.infer<typeof BaseResponseSchema>;



//register ResponseDto
export const RegisterResponseSchema = z.object({
  id: z.string(), // Maps from MongoDB's _id
  email: z.email("Invalid Email Address"),
  emailSent:z.boolean(),
  createdAt: z.string(), // ISO string from timestamps
});
export const RegisterResponse = BaseResponseSchema.extend({data:RegisterResponseSchema});
export type RegisterResponseDTO = z.infer<typeof RegisterResponse>;



//verifyEmailDTO
export const VerifyEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must only contain numbers") // Ensures it's a numeric string
});
export type VerifyEmailDTO = z.infer<typeof VerifyEmailSchema>;



//verify OTP DTO
export const VerifyOtpSchema = z.object({
  userId: z.string(),
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must only contain numbers"), 
  otpContext:  z.enum(OtpType)
});
export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;


//resetPassword DTO
export const ResetPasswordSchema=z.object({
  email:z.email(),
  otp:z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must only contain numbers"), 
  newPassword:z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});
export type ResetPasswordDTO=z.infer<typeof ResetPasswordSchema>;


 //LoginDTO: Logic for authentication 
export const LoginSchema = z.object({
  email: z.email("Invalid email format")
    .min(1, "Email is required"),    
  password: z.string()
    .min(1, "Password is required"), 
}); 
export type LoginDTO = z.infer<typeof LoginSchema>;

 

//UserResponseDTO
export const UserResponseSchema = z.object({
  userId: z.string(), // Maps from MongoDB's _id
  email:z.email(),
  role: z.string(),
  hasProfile: z.boolean(),
  accessToken: z.string(),
  refreshToken: z.string ,
});
export const UserResponse = BaseResponseSchema.extend({data:UserResponseSchema});
export type UserResponseDTO = z.infer<typeof UserResponse>;



//GoogleLoginDTO
export const GoogleLoginSchema=z.object({
  id:z.string(),
  email:z.email(),
});
export type  GoolgleLoginDTO =z.infer<typeof GoogleLoginSchema>;


   
//updateRoleDTO
export const updateRoleSchema=z.object({
email:z.email(),
chosenRole:UserRole,
});
export type  UpdateRoleDTO=z.infer<typeof updateRoleSchema>


//AuthMe response DTO
export const AuthMeResponseSchema=z.object({
  userId: z.string(), // Maps from MongoDB's _id
  email:z.email(),
  role: z.string(),
  hasProfile: z.boolean(),
})
export const AuthMeResponse = BaseResponseSchema.extend({data:AuthMeResponseSchema});
export type AuthMeResponseDTO = z.infer<typeof AuthMeResponse>;
