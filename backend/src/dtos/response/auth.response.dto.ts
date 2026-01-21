import { UserRole } from "@/models/user.model";

export interface BaseResponseDTO {
  success: boolean;
  message: string;
  statusCode: number;
}

export interface  RegisterDataDTO{   
    id: string,
    email: string,
    role: UserRole,    
    createdAt: string,  
    
}

export interface RegisterResponseDTO extends BaseResponseDTO{
  data: RegisterDataDTO,
  emailSent: boolean,
  
}
//UserResponseDTO
export interface UserDataDTO {
      id:string
      email:string,
      role: string,     
      hasProfile?: boolean,
}
export interface UserResponseDTO extends BaseResponseDTO{
  user:UserDataDTO,  
  accessToken: string,
  refreshToken:string 
};
export interface LoginResponseDTO extends UserResponseDTO{
  isVerified:boolean
}


//  authMe
export interface AuthMeResponseDto extends BaseResponseDTO{ 
  user:UserDataDTO
};

// refresh  tokens
export interface RefreshTokensResponse {
  accessToken:string,
  refreshToken:string
};






 

