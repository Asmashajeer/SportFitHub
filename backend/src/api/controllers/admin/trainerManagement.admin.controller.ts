import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { ITrainerManagementService } from '@/interfaces/services/admin/ITrainerManagementService';
import { AuthRequest } from '@/middleware/auth.middleware';
import Logger from '@/utils/logger';

import { NextFunction, Request, Response } from 'express';

export class TrainerManagementController {
  private _trainerManagementService: ITrainerManagementService;
  constructor(trainerManagementService: ITrainerManagementService) {
    this._trainerManagementService = trainerManagementService;
  }

  allTrainers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const search = req.query.search as string;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const { user } = req as AuthRequest;
    try {
      const trainers = await this._trainerManagementService.getTrainers({ page, limit, search, status, category }, user);
      if (!trainers) {
        res.status(STATUS_CODE.SUCCESS.OK).json({ success: true, message: 'No  trainers found', trainers: [] });
        return;
      }
      res.status(STATUS_CODE.SUCCESS.OK).json(trainers);
    } catch (error) {
      next(error);
    }
  };

  getAllPendingTrainers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req as AuthRequest;
    try {
      const pendingTrainers = await this._trainerManagementService.getPendingTrainers(user);
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
    const { user } = req as AuthRequest;
    try {
      const trainerData = await this._trainerManagementService.trainerDetailsById(id, user);
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
    const { user } = req as AuthRequest;
    try {
      const trainerData = await this._trainerManagementService.updateFileStatus(id, targetField, status, reason, user);

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
    const { user } = req as AuthRequest;
    try {
      const trainerData = await this._trainerManagementService.updateTrainerStatus(id, status, reason, user);
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
