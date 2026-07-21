import { STATUS_CODE } from '@/constants/messages';
import { ISessionManagementService } from '@/interfaces/services/admin/ISessionMnagement.service';

import { NextFunction, Request, Response } from 'express';

export class SessionManagementController {
  private _sessionManagementService: ISessionManagementService;
  constructor(sessionManagementService: ISessionManagementService) {
    this._sessionManagementService = sessionManagementService;
  }

  //---------------get sessions Stats---------
  getSessionStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sportsStats, fitnessStats } = await this._sessionManagementService.getSessionStats();

      res.status(STATUS_CODE.SUCCESS.OK).json({ sportsStats, fitnessStats });
    } catch (error) {
      next(error);
    }
  };

  //---------------get sessions---------
  getSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionModel } = req.params;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sessionType = req.query.type as string;
    const mode = req.query.mode as string;

    try {
      const sessionsData = await this._sessionManagementService.getSessions(sessionModel, { page, limit, search, status, sessionType, mode });

      res.status(STATUS_CODE.SUCCESS.OK).json({ sessionsData });
    } catch (error) {
      next(error);
    }
  };

  //--------get session details to admin--------------
  getSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionModel, id } = req.params;
    try {
      const session = await this._sessionManagementService.getSession(sessionModel, id);

      res.status(STATUS_CODE.SUCCESS.OK).json(session);
    } catch (error) {
      next(error);
    }
  };
  //---------------approve/reject session---------
  approveSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionModel, id } = req.params;
    const { isApproved } = req.body;
    console.log(sessionModel, id, isApproved);

    try {
      const session = await this._sessionManagementService.approveSession(sessionModel, id, isApproved);

      res.status(STATUS_CODE.SUCCESS.OK).json({ session });
    } catch (error) {
      next(error);
    }
  };
  //---------------activat/deactivate session---------
  activateSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionModel, id } = req.params;
    const { isActive } = req.body;
    console.log(sessionModel, id, isActive);

    try {
      const session = await this._sessionManagementService.activateSession(sessionModel, id, isActive);

      res.status(STATUS_CODE.SUCCESS.OK).json({ session });
    } catch (error) {
      next(error);
    }
  };
}
