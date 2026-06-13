import {  Response, NextFunction } from 'express';
import { timezoneStorage } from '@/context/timezone.context';
import { AuthRequest } from './auth.middleware';

export const timezoneMiddleware=(req:AuthRequest, res:Response, next:NextFunction )=>{
       const timezone=req.user?.timezone||'UTC';
       timezoneStorage.run(timezone, () => next());
}