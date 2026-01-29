import type { Request, Response, NextFunction } from 'express';
import AppError from './../utils/AppError'
const errorHandler = (
  err: AppError | Error,
  req: Request, 
  res: Response, 
  next: NextFunction) => {
  console.log(`Error:`, err);
  const statusCode = err instanceof AppError ? err.status : 500;
  const message=err.message||'Internal Server Error';
  return res.status(statusCode).json({message});
};
export default errorHandler;
