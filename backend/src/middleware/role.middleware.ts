import type {  Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import type { AuthRequest } from './auth.middleware.ts';
import { user_role_onRoute} from '@/constants/enums';

type Role = user_role_onRoute;
export const restrictTo = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      next(
        new AppError(
          'Access Denied: User not authenticated (Missing Token or Failed Verification',
          401,
        ),
      );
    } else {
      const userRole: string = req.user.role;
      if (allowedRoles.toString().includes(userRole)) next();
      else next(new AppError('forbidden role', 403));
    }
  };
};
