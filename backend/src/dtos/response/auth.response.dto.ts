import { UserRole } from '@/constants/enums';

export interface BaseResponseDTO {
  success: boolean;
  message: string;
  statusCode: number;
}

export interface RegisterDataDTO {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  timezone: string;
  isVerified: boolean;
}

export interface RegisterResponseDTO extends BaseResponseDTO {
  user: RegisterDataDTO;
  emailSent: boolean;
}
//UserResponseDTO
export interface UserDataDTO extends RegisterDataDTO {
  hasProfile?: boolean;
}

export interface UserResponseDTO extends BaseResponseDTO {
  user: UserDataDTO;
  accessToken: string;
  refreshToken: string;
}
export interface LoginResponseDTO extends UserResponseDTO {
  isVerified: boolean;
}

//  authMe
export interface AuthMeResponseDto extends BaseResponseDTO {
  user: UserDataDTO;
}

// refresh  tokens
export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}
