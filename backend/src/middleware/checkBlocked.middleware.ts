import { Request,Response,NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { IUserRepository } from "@/interfaces/repositories/IUser.repository";
import AppError from "@/utils/AppError";
import { ERROR_MESSAGES, STATUS_CODE } from "@/constants/messages";

export const checkBlocked = (userRepo: IUserRepository) => {
  return async (req:Request , res: Response, next: NextFunction) => {
    const authReq= req as AuthRequest
    try {
      const user = await userRepo.findById(authReq.user.id);

      if (!user) {
        return next(new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND));
      }

      if (user.isBlocked) {        
        return next(new AppError(ERROR_MESSAGES.AUTH.BLOCKED_USER, STATUS_CODE.ERROR.FORBIDDEN));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};