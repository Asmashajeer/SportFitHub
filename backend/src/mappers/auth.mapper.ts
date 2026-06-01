import { RegisterDataDTO, UserDataDTO } from '@/dtos/response/auth.response.dto';
import { IUser } from '@/models/user.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

export const toRegisterData = (user: IUser): RegisterDataDTO => {
  const timezone = getTimezone();
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email || '',
    role: user.role,
    timezone:user.timezone,
    isVerified: user.isVerified,
  };
};

export const toUserData = (user: IUser): UserDataDTO => {
  const timezone = getTimezone();
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    timezone:user.timezone,
    isVerified: user.isVerified,
  };
};
