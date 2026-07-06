import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../utils/logger';
import AppError from './../utils/AppError';
const errorHandler: ErrorRequestHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.log(`Error:`, err);
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.status : 500;
  const message =err.message ;
    // isAppError || process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';

  logger.error(message, {
    statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
    details: isAppError ? err.errors : undefined,
  });
  return res.status(statusCode).json({ message });
};
export default errorHandler;
