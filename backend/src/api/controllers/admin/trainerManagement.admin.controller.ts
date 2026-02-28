import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { ITrainerManagementService } from '@/interfaces/services/admin/ITrainerManagementService';
import Logger from '@/utils/logger';

import { NextFunction, Request, Response } from 'express';

export class TrainerManagementController {
  private _trainerManagementService: ITrainerManagementService;
  constructor(trainerManagementService: ITrainerManagementService) {
    this._trainerManagementService = trainerManagementService;
  }
  getAllPendingTrainers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pendingTrainers = await this._trainerManagementService.getPendingTrainers();
      if (!pendingTrainers || pendingTrainers.length === 0) {
        res.status(STATUS_CODE.SUCCESS.OK).json({
          success: true,
          message: 'No pending trainers found',
          pendingTrainers: [],
        });
        return;
      }
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: 'Pending Trainers',
        pendingTrainers,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get a trainer
  trainerDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;
    try {
      const trainerData = await this._trainerManagementService.trainerDetailsById(id);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TRAINER.TRAINER_FETCH_SUCCESS,
        trainerData,
      });
    } catch (error) {
      next(error);
    }
  };

  updateFileStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, targetField, status, reason } = req.body;
    try {
      const trainerData = await this._trainerManagementService.updateFileStatus(
        id,
        targetField,
        status,
        reason
      );

      Logger.info(`Admin updated Trainer ${targetField} Status to ${status}`, {
        trainerId: id,
        targetField: status,
        reason: reason,
      });
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TRAINER.TRAINER_DOC_STATUS_UPDATED,
        trainerData,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTrainerStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, status, reason } = req.body;
    try {
      const trainerData = await this._trainerManagementService.updateTrainerStatus(
        id,
        status,
        reason
      );
      Logger.info(`Admin updated Trainer status to ${status} for ID: ${id}`, {
        trainerId: id,
        newStatus: status,
        reason: reason,
      });
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TRAINER.TRAINER_DOC_STATUS_UPDATED,
        trainerData,
      });
    } catch (error) {
      next(error);
    }
  };
}
