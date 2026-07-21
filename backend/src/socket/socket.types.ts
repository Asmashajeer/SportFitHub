import { UserRole } from '@/constants/enums';
import { Socket } from 'socket.io';

export interface AuthSocketUser {
  id: string;
  email: string;
  role: UserRole;
  timezone: string;
}

export interface AuthenticatedSocket extends Socket {
  user?: AuthSocketUser;
}
