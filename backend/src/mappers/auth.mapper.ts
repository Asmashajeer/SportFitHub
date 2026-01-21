import { RegisterDataDTO, RegisterResponseDTO, UserDataDTO, UserResponseDTO } from "@/dtos/response/auth.response.dto";
import { IUser } from "@/models/user.model";

export const toRegisterData = (user: IUser): RegisterDataDTO=> {
  return {
    id: user._id.toString(),    
    email: user.email || '',    
    role: user.role,    
    createdAt: user.createdAt.toString() || new Date().toString(),  
  }   
};

export const toUserData=(user:IUser):UserDataDTO=>{
   return{ 
    id:user._id.toString(),
    email:user.email,
    role: user.role,
   }  
}