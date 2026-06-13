import { IProfileService } from '@/interfaces/services/user/IProfile.service';

import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import type { Request, Response, NextFunction } from 'express';

import Logger from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth.middleware';

export class ProfileController {
  private _profileService: IProfileService;
  constructor(profileService: IProfileService) {
    this._profileService = profileService;
  }

  addProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq=req as AuthRequest
      const user = authReq.user ;
      const userId = user.id;
      console.log(userId);
      const profileData = await this._profileService.addProfile({ userId, ...req.body });
      Logger.info('User completed the profile', { 'user id': userId });
      res.status(STATUS_CODE.SUCCESS.CREATED).json({
        message: SUCCESS_MESSAGES.USER.PROFILE_CREATED,
        profileData,
      });
    } catch (error) {
      next(error);
    }
  };
  getAllProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq=req as AuthRequest
      const user = authReq.user ;
      const userId = user.id;
      const profiles = await this._profileService.getProfiles(userId);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profiles,
      });
    } catch (error) {
      next(error);
    }
  };
  getProfilePic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq=req as AuthRequest
      const user = authReq.user ;
      const userId = user.id;
      const profile = await this._profileService.getPrimaryProfile(userId);
      const profilePic = profile.profilePic;
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profilePic,
      });
    } catch (error) {
      next(error);
    }
  };
  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user 
      const userId = user.id;
      const profile = await this._profileService.getPrimaryProfile(userId);

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data = req.body.profile;
      const profileData = await this._profileService.updateProfile(id, data);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profileData,
      });
    } catch (error) {
      next(error);
    }
  };
}
