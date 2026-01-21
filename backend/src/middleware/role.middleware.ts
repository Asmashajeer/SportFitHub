import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import type { AuthRequest } from './auth.middleware.ts';

type Role = 'user' | 'trainer' | 'admin';
export const roleMiddleware = (allowedRoles: Role[]) => {
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
