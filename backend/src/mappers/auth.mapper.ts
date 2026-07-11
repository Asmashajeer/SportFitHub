import { RegisterDataDTO, UserDataDTO } from '@/dtos/response/auth.response.dto';
import { IUser } from '@/models/user.model';

export const toRegisterData = (user: IUser): RegisterDataDTO => {
 
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email || '',
    roles: user.roles,
    activeRole :user.activeRole,
    timezone:user.timezone,
    isVerified: user.isVerified,
  };
};

export const toUserData = (user: IUser): UserDataDTO => {

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: user.roles,
    activeRole :user.activeRole,
    timezone:user.timezone,
    isVerified: user.isVerified,
  };
};
 export const toIAuthUser=(user:IUser)=>{
   return{
      id: user.id.toString(),
      email: user.email,
      role: user.activeRole,
      timezone: user.timezone,
   }
 }