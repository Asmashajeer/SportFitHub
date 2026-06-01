import { usersResposeDTO } from '@/dtos/response/admin/user.dto';
import { IUser } from '@/models/user.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";

export const toUsersResponseData = (user: IUser): usersResposeDTO => {
  const timezone = getTimezone();
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,

    role: user.role,
    googleId: user.googleId || ' ',
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
    isActive: user.isActive,
    createdAt: formatInTimeZone(user.createdAt,timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
           
  };
};
