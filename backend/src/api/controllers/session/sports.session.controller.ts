
import { PAGINATION_LIMIT } from '@/constants/enums';
import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { ISportsSessionService } from '@/interfaces/services/session/ISports.session.service';
import { AuthRequest } from '@/middleware/auth.middleware';

import { NextFunction, Request, Response } from 'express';

export class SportsSessionController {
  private _sportsSessionService: ISportsSessionService;

  constructor(sportsSessionService: ISportsSessionService) {
    this._sportsSessionService = sportsSessionService;
  }

  //------create session----------
  createSportSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body;
    try {
      const session = await this._sportsSessionService.createSportSession(data);

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
  updateSportSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req.body;
    const id=req.params.id;
    try {
      const session = await this._sportsSessionService.updateSportSession(id,data);
      
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
    deleteSportSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
       
        const id=req.params.id;
        try {
          const session = await this._sportsSessionService.deleteSportSession(id);;
          
          res.status(STATUS_CODE.SUCCESS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.SESSION.SESSION_DELETED,
            session,
          });
        } catch (error) {
          next(error);
        }
      };


//-----------------get session by trainer---------------------------------
  getTrainerSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq=req as AuthRequest
    const user = authReq.user ;
    const userId = user.id;
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || "";
    const limit=req.query.limit as string || 10;

    try {
      const result = await this._sportsSessionService.getSessionsByTrainer(userId,{page,search,limit});

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.FETCHED,
        sessions: result.sessions,       
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };


  // -----------------get all Sports Session-public------------------------
  getAllSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const { 
      page = '1',limit = PAGINATION_LIMIT,search,sport,sessionType,ageGroup,lat, lng,radius } = req.query;
    const filters = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      sport: sport as string,
      sessionType: sessionType as string,
      ageGroup: ageGroup as string,
      lat :parseFloat(lat as string),
      lng :parseFloat(lng as string),
      radius :parseInt(radius as string)||0,
    };
    console.log( "getlocation",lat,lng,radius);
    try {
      const result = await this._sportsSessionService.getAllSessions(filters);

      res.status(STATUS_CODE.SUCCESS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.GENERAL.FETCHED,
        sessions: result.sessions,       
        pagination: result.pagination
        
      });
    } catch (error) {
      next(error);
    }
  };

// ---------------------------get a session by session ID--------------------

  getSportSession=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      const sessionId=req.params.id;
      const session = await this._sportsSessionService.getASession(sessionId);
      res.status(STATUS_CODE.SUCCESS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.GENERAL.FETCHED,
          session, 
        })
      } catch (error) {
      next(error);
    }
  }

}
