import AppError from '@/utils/AppError';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import authConfig from '@/config/auth.config';
import { UserRole } from '@/constants/enums';
import { AuthenticatedSocket } from '../socket/socket.types';
import { parse } from 'cookie';

export const SocketAuthMiddleware = (socket: AuthenticatedSocket, next: (error?: Error) => void) => {

  const rawCookies = socket.handshake.headers.cookie;
  if (!rawCookies) {
    console.log('Unauthorized: no cookies sent');
    return next(new AppError('Unauthorized: no cookies sent'));
  }
  const cookies = parse(rawCookies);
  const accessToken = cookies.accessToken;
  if (!accessToken) {
    return next(new AppError('Unauthorized: Access Token missing   !!.', 401));
  }
  try {
    const decoded = jwt.verify(accessToken, authConfig.secret) as { id: string; email: string; role: UserRole; timezone: string };
    (socket as AuthenticatedSocket).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      timezone: decoded.timezone,
    };
    console.log('verified');
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof TokenExpiredError) return next(new AppError('Unauthorized: Access Token expired.!!', 401));
    if (error instanceof JsonWebTokenError) return next(new AppError('Unauthorised  Invalid Token !!', 403));
    return next(new AppError('unauthorised  Internal Server Authentication Error !!'));
  }
};
