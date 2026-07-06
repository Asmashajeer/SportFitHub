import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { UserRole } from '@/constants/enums';
const { JsonWebTokenError, TokenExpiredError } = jwt;
export interface AuthUser{ 
    id: string;
    email:string;
    role: UserRole;    
    timezone:string
  }

export interface AuthRequest extends Request {
  user?:AuthUser
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return next(new AppError('Unauthorized: Access Token missing.', 401));
  }
  try {
    const decoded = jwt.verify(accessToken, authConfig.secret) as { id: string;email:string, role: UserRole,timezone: string; };
    req.user = {
      id: decoded.id,
      email:decoded.email,
      role: decoded.role,
      timezone:decoded.timezone,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return next(new AppError('Unauthorized: Access Token expired.', 401));
    if (error instanceof JsonWebTokenError)
      return next(new AppError('Unauthorised  Invalid Token', 403));
    return next(new AppError('unauthorised  Internal Server Authentication Errror'));
  }
};
