import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { ITrainerService } from '@/interfaces/services/trainer/Itrainer.service';
import { AuthRequest } from '@/middleware/auth.middleware';

import Logger from '@/utils/logger';

import { setAuthCookies } from '@/utils/set.cookies';

import { Request, Response, NextFunction } from 'express';

export class TrainerController {
  private _trainerService: ITrainerService;

  constructor(trainerService: ITrainerService) {
    this._trainerService = trainerService;
  }

  addProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req as AuthRequest;

      await this._trainerService.checkExistingProfile(user.id);

      const profileData = {
        userId: user.id,
        ...req.body,
      };
      const result = await this._trainerService.addProfile(profileData, user);
      Logger.info('Trainer created an application', { id: user.id });
      if (result.tokens) {
        setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      }
      const { tokens, ...profile } = result;
      res.status(STATUS_CODE.SUCCESS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.USER.PROFILE_CREATED,
        profileData: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  //-------------------profile pic---------
  getProfilePic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.getTrainerByUserId(user);
      const profilePic = profile.profilePic;
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profilePic,
      });
    } catch (error) {
      next(error);
    }
  };

  //------------get profile
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req as AuthRequest;
      console.log(user);
      const profile = await this._trainerService.getTrainerByUserId(user);

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
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
      const profileData = await this._trainerService.updateProfilePic(id, profilePic, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profileData,
      });
    } catch (error) {
      next(error);
    }
  };
  updateBasicInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.updateBasicInfo(id, data, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };
  updatePersonalInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.updatePersonalInfo(id, data, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCertificates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { documents } = req.body;
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.updateCertificate(id, documents, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };
  updateIdverification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.updateIdVerification(id, data, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };
  updateAvailabilityPricing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.updateAvailabilityPricing(id, data, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePaymentInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const { user } = req as AuthRequest;

      const profile = await this._trainerService.updatePaymentInfo(id, data, user);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    const { user } = req as AuthRequest;
    try {
      const profile = await this._trainerService.resubmitApplicaion(id, status, user);
      Logger.info(`Resubmitted the application  for ID: ${id}`, {
        trainerId: id,
        newStatus: status,
      });
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TRAINER.TRAINER_DOC_STATUS_UPDATED,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };
}
