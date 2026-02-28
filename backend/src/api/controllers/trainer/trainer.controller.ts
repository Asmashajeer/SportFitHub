import { TRAINER_STATUS } from '@/constants/enums';
import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { ITrainerService } from '@/interfaces/services/trainer/Itrainer.service';
import { IUser } from '@/models/user.model';
import Logger from '@/utils/logger';

import { Request, Response, NextFunction } from 'express';

export class TrainerController {
  private _trainerService: ITrainerService;

  constructor(trainerService: ITrainerService) {
    this._trainerService = trainerService;
  }

  addProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user.id;
      await this._trainerService.checkExistingProfile(userId);

      const profile = {
        userId,
        ...req.body,
      };
      const result = await this._trainerService.addProfile(profile);
      Logger.info('Trainer created an application', { id: user.id });
      res.status(STATUS_CODE.SUCCESS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.USER.PROFILE_CREATED,
        profileData: result,
      });
    } catch (error) {
      next(error);
    }
  };
  getProfilePic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user.id;
      const profile = await this._trainerService.getTrainerByUserId(userId);
      const profilePic = profile.profilePic;
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profilePic,
      });
    } catch (error) {
      next(error);
    }
  };
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUser;
      const userId = user.id;
      const profile = await this._trainerService.getTrainerByUserId(userId);

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
      const documents = req.body;
      const profile = await this._trainerService.updateCertificate(id, documents);
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
      const profile = await this._trainerService.updateIdVerification(id, data);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };
  updateAvailabilityPricing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;
      const profile = await this._trainerService.updateAvailabilityPricing(id, data);
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
      const profile = await this._trainerService.updatePaymentInfo(id, data);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(
      'HELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO'
    );
    const { id } = req.params;
    console.log(id);
    const { status } = req.body;
    console.log(status);
    try {
      const profile = await this._trainerService.resubmitApplicaion(id, status);
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
