import api from "../../../api/axiosInstance";
import type {
  AuthResponse,
  BaseResponse,
  LoginResponse,
  RegisterResponse,
  ResendOtpResponse,
} from "../types/auth.types";
import type {
  LoginCredentials,
  registerCredentials,  
  ResendOtpData,
  ResetPasswordData,
  verifyOTPData,
} from "../types/auth.schema";
import type { UserRole } from "../../../constants/constants";
import { AUTH_ROUTES } from "./auth.api";

export const authService = {
  register: async (
    credentials: registerCredentials,
  ): Promise<RegisterResponse> => {
    const response = await api.post(AUTH_ROUTES.REGISTER, credentials); 
     
    return response.data;

  },
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post(AUTH_ROUTES.LOGIN, credentials);
    return response.data;
  },
  logout: async () => {
    await api.post(AUTH_ROUTES.LOGOUT);
  },

  getMe: async () => {
    try{
      const response = await api.get(AUTH_ROUTES.GET_ME);      
      return response.data;
    } catch(error:unknown){
      // if(error instanceof Error){
      // const message=error.status||'Authentication Error';
        throw error;
      // }
        // throw new Error(error);
    }
  },
  verify: async (verifyData: verifyOTPData): Promise<AuthResponse> => {
    const response = await api.patch(AUTH_ROUTES.VERIFY_EMAIL, verifyData);
    return response.data;
  },
  resendOtp: async (data: ResendOtpData): Promise<ResendOtpResponse> => {
    const response = await api.post(AUTH_ROUTES.RESEND_OTP, data);
    return response.data;
  },
  forgotPassword: async (email: string): Promise<BaseResponse> => {
    return await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
  },
  resetPassword: async (data: ResetPasswordData): Promise<BaseResponse> => {
    return await api.patch(AUTH_ROUTES.RESET_PASSWORD, data);
  },
  googleLogin: async (idToken: string) => {
    try {
      const response = await api.post(AUTH_ROUTES.GOOGLE_LOGIN, {
        token: idToken,
      });
      return response.data;
    } catch (error: unknown) {
      if(error instanceof Error){
        const message= error.message || "Google Login failed";
        throw new Error(message);
      }
    }
  },
  updateRole: async (email: string, selectedRole: UserRole) => {
    const response = await api.patch(AUTH_ROUTES.ADD_ROLE, {
      email,
      role: selectedRole,
    });
    return response.data;
  },
  refresh: async () => {
    const response = await api.post(AUTH_ROUTES.REFRESH_TOKEN);
    return response.data;
  },
};
