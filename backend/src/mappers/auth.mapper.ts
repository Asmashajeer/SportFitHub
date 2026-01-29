import { RegisterDataDTO, RegisterResponseDTO, UserDataDTO, UserResponseDTO } from "@/dtos/response/auth.response.dto";
import { IUser } from "@/models/user.model";

export const toRegisterData = (user: IUser): RegisterDataDTO=> {
  return {
    id: user._id.toString(), 
    name:user.name,  
    email: user.email || '',    
    role: user.role, 
    isVerified:user.isVerified,   
    
  }   
};

export const toUserData=(user:IUser):UserDataDTO=>{
   return{ 
    id:user._id.toString(),
    name:user.name,
    email:user.email,
    role: user.role,
    isVerified:user.isVerified,   

   }  
}