import { usersResposeDTO } from '@/dtos/response/admin/user.dto';
import { IUser } from '@/models/user.model';

export const toUsersResponseData = (user: IUser): usersResposeDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,

    role: user.role,
    googleId: user.googleId || ' ',
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
    isActive: user.isActive,
    createdAt: user.createdAt.toString(),
  };
};
