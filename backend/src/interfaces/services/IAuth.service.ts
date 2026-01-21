import { LoginDTO, RegisterRequestDTO ,UpdateRoleDTO , VerifyEmailDTO, VerifyOtpDTO,ResetPasswordDTO,GoolgleLoginDTO} from '@/dtos/request/auth.request.dto';
import {   RegisterResponseDTO, UserResponseDTO, BaseResponseDTO, RegisterDataDTO, UserDataDTO, AuthMeResponseDto } from '@/dtos/response/auth.response.dto.js';
import { OtpType } from "@/models/otp.model";

export interface IAuthService {
    register(userData: RegisterRequestDTO): Promise<RegisterResponseDTO> ;
    verifyEmail(data:VerifyEmailDTO):Promise<UserResponseDTO>;
    verifyOTPInternal(data:VerifyOtpDTO),
    resendOtp(email:string,otpContext:OtpType):Promise<RegisterResponseDTO>;
    resetPassword( data:ResetPasswordDTO):Promise<BaseResponseDTO>;
    login(data:LoginDTO ): Promise<UserResponseDTO>;
    googleLogin(token: string):Promise <UserResponseDTO>;
    updateRole(data:UpdateRoleDTO):Promise<UserResponseDTO>;
     authMe(userId:string):Promise<AuthMeResponseDto>
    refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>

}