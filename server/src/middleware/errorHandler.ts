import type { Request, Response, NextFunction } from 'express';
import AppError from './../utils/AppError'
const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  console.log(`Error:`, err);
  const statusCode = err instanceof AppError ? err.status : 500;
  return res
    .status(statusCode)
    .json({ message: err.message || 'Internal Server Error', success: false });
};
export default errorHandler;
