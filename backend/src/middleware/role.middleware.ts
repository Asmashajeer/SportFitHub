import type { Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import type { AuthRequest } from './auth.middleware.ts';
import { user_role_onRoute } from '@/constants/enums';
import { STATUS_CODE } from '@/constants/messages';

type Role = user_role_onRoute;
export const restrictTo = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Access Denied: User not authenticated (Missing Token or Failed Verification', STATUS_CODE.ERROR.UNAUTHORIZED));
    }
    const userRole = req.user.role as Role;
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    return next(new AppError('Forbidden: Access denied', STATUS_CODE.ERROR.FORBIDDEN));
  };
};
