import api from "../../../api/axiosInstance";
import type { AuthResponse, BaseResponse, LoginResponse, RegisterResponse, ResendOtpResponse } from "../types/auth.types";
import type { LoginCredentials, ResendOtpData, ResetPasswordData, verifyOTPData } from "../types/auth.schema";
import type { UserRole } from "../../../constants/constants";
import { useAuthStore } from "../store/useAuthStore";


export const authService={
   
    register: async (credentials:LoginCredentials):Promise<RegisterResponse>=>{
        const response=await api.post('/auth/register',credentials);
        console.log(response.data);
        return response.data;
    },
    login: async (credentials:LoginCredentials):Promise<LoginResponse>=>{
        const response=await api.post('/auth/login',credentials);
        return response.data;
    },
    logout: async ()=>{
            await api.post('/auth/logout');     
    },
    // getMe: async () => {
    //     const response = await api.get('/auth/authMe');       
    //     return response.data;
    // }
    getMe: async (token?: string) => {
        const headerToken = token || useAuthStore.getState().accessToken;
        const response = await api.get('/auth/authMe', {
            headers: {
            Authorization: `Bearer ${headerToken}`
            }
        });
       
        return response.data;    

    },
    verify:async (verifyData:verifyOTPData):Promise<AuthResponse>=>{
        const response= await api.patch('/auth/verifyEmail',verifyData);
        return response.data;
    },
    resendOtp:async(data:ResendOtpData):Promise<ResendOtpResponse>=>{
        const response= await api.post('/auth/resendOtp',data);
        return response.data;
    },
    forgotPassword: async(email:string):Promise<BaseResponse>=>{
       return await api.post ('/auth/forgotPassword',{email});
    },
    resetPassword: async(data:ResetPasswordData):Promise<BaseResponse>=>{
        return await api.patch ('/auth/resetPassword',data);        
    },
    googleLogin:async(idToken: string)=>{
        try {      
                const response = await api.post('/auth/google-login', { token: idToken });
                return response.data;    
      
            } catch (error: any) {            
                throw error.response?.data?.message || 'Google Login failed';
            }
   },
   updateRole:async (email:string,selectedRole:UserRole)=>{
        const response = await api.patch('/auth/updateRole', {email, role:selectedRole });
                return response.data;  
   },
   refresh: async () => {
        const response = await api.post('/auth/refresh');       
        return response.data.accessToken; 
    }
   
}