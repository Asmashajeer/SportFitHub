import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { IFitnessManagementService } from '@/interfaces/services/admin/IFitnessManagementService';

import AppError from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';

export class FitnessManagementController {
  private _fitnessManagementService: IFitnessManagementService;
  constructor(fitnessManagementService: IFitnessManagementService) {
    this._fitnessManagementService = fitnessManagementService;
  }

  addProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const program = req.body;
    try {
      const newProgram = await this._fitnessManagementService.addProgram(program);
      res.status(STATUS_CODE.SUCCESS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.FITNESS.PROGRAM_ADDED,
        newProgram,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPrograms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string;
    const status = req.query.status as string;

    try {
      const programs = await this._fitnessManagementService.getPrograms({ page, search, status });

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.FETCHED,
        programs,
      });
    } catch (error) {
      next(error);
    }
  };

  toggleProgramStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;
    try {
      const program = await this._fitnessManagementService.toggleProgramStatus(id);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FITNESS.PROGRAM_STATUS_TOGGLE + program.isActive,
        program,
      });
    } catch (error) {
      next(error);
    }
  };
  updateProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;
    const programData = req.body;
    try {
      const program = await this._fitnessManagementService.updateProgram(id, programData);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.UPDATED,
        program,
      });
    } catch (error) {
      next(error);
    }
  };
  deleteProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;
    try {
      const result = await this._fitnessManagementService.deleteProgram(id);
      if (!result) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: `Program` + SUCCESS_MESSAGES.GENERAL,
        id,
      });
    } catch (error) {
      next(error);
    }
  };
}
