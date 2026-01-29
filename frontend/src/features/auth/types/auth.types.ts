
import type { UserRole } from "@/constants/constants";
import type {User } from "../store/useAuthStore";

//-------------------------------------------API response structure-----------------------
export interface AuthResponse{
  success: boolean,
  message: string,
  statusCode:string,
  user:User  ,
  accessToken:string
}
export interface LoginResponse extends AuthResponse {
  isVerified:boolean
}
export interface RegisterResponse{
  user:{
    id:string,
      name:string
      email:string,
      role: UserRole,  
      isVerified:boolean,           
  },
  emailSent: boolean,
  message:string
}

export interface ResendOtpResponse{
  emailSent:boolean,
  message:string
}
export interface BaseResponse{
  message:string,
}