import { AuthMeResponseDTO, BaseResponseDTO,  GoolgleLoginDTO, LoginDTO,  RegisterDTO, RegisterResponseDTO, ResetPasswordDTO, UpdateRoleDTO,  UserResponseDTO, VerifyEmailDTO, VerifyOtpDTO } from "@/dtos/auth.dto";
import { OtpType } from "@/models/otp.model";

export interface IAuthService {
    register(userData: RegisterDTO): Promise<RegisterResponseDTO> ;
    verifyEmail(data:VerifyEmailDTO):Promise<UserResponseDTO>;
    verifyOTPInternal(data:VerifyOtpDTO),
    resendOtp(email:string,otpContext:OtpType):Promise<RegisterResponseDTO>;
    resetPassword( data:ResetPasswordDTO):Promise<BaseResponseDTO>;
    login(data:LoginDTO ): Promise<UserResponseDTO>;
    googleLogin(token: string):Promise <UserResponseDTO>;
    updateRole(data:UpdateRoleDTO):Promise<UserResponseDTO>;
     authMe(userId:string):Promise<AuthMeResponseDTO>
    refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>

}