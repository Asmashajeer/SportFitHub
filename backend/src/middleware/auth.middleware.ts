import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
const { JsonWebTokenError, TokenExpiredError } = jwt;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // const authHeader = req.headers.authorization;
  // let accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // 2. Fallback to Cookies (if header is missing)
  // if (!accessToken) {
   let accessToken = req.cookies?.accessToken;
  // }
  
  if (!accessToken) {
    return next(new AppError('Unauthorized: Access Token missing.', 401));
  }
  try {
    const decoded = jwt.verify(accessToken, authConfig.secret) as { id: string; role: string };
    req.user = {
      id: decoded.id,
      role: decoded.role,
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
