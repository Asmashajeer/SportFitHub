import { PAGINATION_LIMIT, UserRole } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { IFitnessSessionService } from '@/interfaces/services/session/IFitness.session.service ';
import { AuthRequest } from '@/middleware/auth.middleware';

import { NextFunction, Request, Response } from 'express';

export class FitnessSessionController {
  private _fitnessSessionService: IFitnessSessionService;

  constructor(fitnessSessionService: IFitnessSessionService) {
    this._fitnessSessionService = fitnessSessionService;
  }

  //------create session----------
  createFitnessSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body;
    try {
      const session = await this._fitnessSessionService.createFitnessSession(data);

      res.status(STATUS_CODE.SUCCESS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.SESSION.SESSION_CREATED,
        session,
      });
    } catch (error) {
      next(error);
    }
  };

  //---------------update session---------
  updateFitnessSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body;
    const id = req.params.id;
    try {
      const session = await this._fitnessSessionService.updateFitnessSession(id, data);

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SESSION.SESSION_UPDATED,
        session,
      });
    } catch (error) {
      next(error);
    }
  };

  //----------------delete session----------
  deleteFitnessSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;
    const userRole = req.user.role;
    try {
      if (userRole === UserRole.TRAINER) {
        const session = await this._fitnessSessionService.deleteFitnessSession(id, userRole);

        res.status(STATUS_CODE.SUCCESS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.SESSION.SESSION_DELETED,
          session,
        });
      } else if (userRole === UserRole.USER) {
        res.status(STATUS_CODE.ERROR.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.USER.USER_FORBIDDEN + ' delete the session',
        });
      } else {
        res.status(STATUS_CODE.ERROR.FORBIDDEN).json({
          success: false,
          message: ERROR_MESSAGES.AUTH.FORBIDDEN,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  //-----------------get session by trainer---------------------------------
  getTrainerSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthRequest;
    const userId = authReq.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const search = (req.query.search as string) || '';
    const limit = (req.query.limit as string) || 10;
    try {
      const result = await this._fitnessSessionService.getSessionsByTrainer(userId, { page, search, limit });

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.FETCHED,
        sessions: result.sessions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // -----------------get all Fitness Session-------------------------
  getAllSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, search, program, sessionType, ageGroup, lat, lng, radius } = req.query;
    const filters = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || PAGINATION_LIMIT,
      search: search as string,
      program: program as string,
      sessionType: sessionType as string,
      ageGroup: ageGroup as string,
      lat: parseInt(lat as string),
      lng: parseInt(lng as string),
      radius: parseInt(radius as string),
    };
    try {
      const result = await this._fitnessSessionService.getAllSessions(filters);

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.FETCHED,
        sessions: result.sessions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // ---------------------------get session by session ID--------------------

  getFitnessSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.params.id;

      const session = await this._fitnessSessionService.getASession(sessionId);
      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.FETCHED,
        session,
      });
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------make active/Inactive a session----------------

  updateSessionVisibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isActive = req.body.isActive;
    const id = req.params.id;
    try {
      const session = await this._fitnessSessionService.updateSessionVisibility(id, isActive);

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SESSION.SESSION_UPDATED,
        session,
      });
    } catch (error) {
      next(error);
    }
  };
}
