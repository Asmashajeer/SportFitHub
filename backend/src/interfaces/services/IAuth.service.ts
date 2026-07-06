import {
  LoginDTO,
  RegisterRequestDTO,
  UpdateRoleDTO,
  VerifyEmailDTO,
  VerifyOtpDTO,
  ResetPasswordDTO,
} from '@/dtos/request/auth.request.dto';
import {
  RegisterResponseDTO,
  UserResponseDTO,
  BaseResponseDTO,
  AuthMeResponseDto,
} from '@/dtos/response/auth.response.dto.js';
import { OtpType } from '@/constants/enums';

export interface IAuthService {
  register(userData: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  verifyEmail(data: VerifyEmailDTO): Promise<UserResponseDTO>;
  verifyOTPInternal(data: VerifyOtpDTO);
  resendOtp(email: string, otpContext: OtpType): Promise<RegisterResponseDTO>;
  resetPassword(data: ResetPasswordDTO): Promise<BaseResponseDTO>;
  login(data: LoginDTO): Promise<UserResponseDTO>;
  googleLogin(token: string): Promise<UserResponseDTO>;
  updateRole(data: UpdateRoleDTO): Promise<UserResponseDTO>;
  authMe(userId: string): Promise<AuthMeResponseDto>;
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  updateFcmToken(userId: string, fcmToken: string): Promise<void> 
}
