import { IProfileService } from '@/interfaces/services/user/IProfile.service';

import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import type { Request, Response, NextFunction } from 'express';

import Logger from '@/utils/logger';
import { AuthRequest } from '@/middleware/auth.middleware';
import { setAuthCookies } from '@/utils/set.cookies';

export class ProfileController {
  private _profileService: IProfileService;
  constructor(profileService: IProfileService) {
    this._profileService = profileService;
  }

  addProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
           const { user } = req as AuthRequest;
     
      const result = await this._profileService.addProfile({ userId:user.id, ...req.body });
      Logger.info('User completed the profile', { 'user id': user.id });
      if(result.tokens){
              setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
            }
      const {tokens,...profileData}=result;
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
            const { user } = req as AuthRequest;

      const profiles = await this._profileService.getProfiles(user.id);
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
      const { user } = req as AuthRequest;

      const id=req.params.id;
      const profile = await this._profileService.getPrimaryProfile(user.id);
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
      const { user } = req as AuthRequest;

      const profile = await this._profileService.getPrimaryProfile(user.id);

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
      const { user } = req as AuthRequest;

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
  updateProfilePic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req as AuthRequest;

      const id = req.params.id;
      const profilePic = req.body.profilePic;
      const profileData = await this._profileService.updateProfile(id,{profilePic:profilePic});
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profileData,
      });
    } catch (error) {
      next(error);
    }
  };
}
