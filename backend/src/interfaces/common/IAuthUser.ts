import { UserRole } from '@/constants/enums';

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
  timezone: string;
}
