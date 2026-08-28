import { PAYLOAD_MODEL } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { IFitnessSessionService } from '@/interfaces/services/session/IFitness.session.service ';
import { ISessionsSearchService } from '@/interfaces/services/session/ISessions.search.service';
import { ISportsSessionService } from '@/interfaces/services/session/ISports.session.service';
import AppError from '@/utils/AppError';

import { NextFunction, Request, Response } from 'express';

export class SessionController {
  private _sportSessionService: ISportsSessionService;
  private _fitnessSessionService: IFitnessSessionService;
  private _sessionsSearchService:ISessionsSearchService;

  constructor(sportSessionService: ISportsSessionService, fitnessSessionService: IFitnessSessionService,sessionSearchService:ISessionsSearchService) {
    this._fitnessSessionService = fitnessSessionService;
    this._sportSessionService = sportSessionService;
    this._sessionsSearchService=sessionSearchService;
  }

  //-----------------------------------fetching booking  payload session Data- ------
  getSessionDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionModel, id } = req.params;

      if (sessionModel === PAYLOAD_MODEL.SPORT_SESSION) {
        const session = await this._sportSessionService.getASession(id);
        res.status(STATUS_CODE.SUCCESS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.GENERAL.FETCHED,
          session,
        });
      } else if (sessionModel === PAYLOAD_MODEL.FITNESS_SESSION) {
        const session = await this._fitnessSessionService.getASession(id);
        res.status(STATUS_CODE.SUCCESS.OK).json({
          success: true,
          message: SUCCESS_MESSAGES.GENERAL.FETCHED,
          session,
        });
      }
    } catch (error) {
      next(error);
    }
  };


// semantic search
searchSessions=async(req: Request, res: Response, next: NextFunction)=> {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || !q.trim()) {
       throw new AppError(ERROR_MESSAGES.SESSION.QUERY_REQUIRED ,STATUS_CODE.ERROR.BAD_REQUEST);
    }

    const sessions = await this._sessionsSearchService.searchSessions(q);
    res.status(STATUS_CODE.SUCCESS.OK).json({ sessions });
  } catch (err) {
    next(err);
  }
}

  // controllers/sessionController.js — wherever you merge results
// const sportsResults = await SportsSession.aggregate([...]); // vector search or normal find
// const fitnessResults = await FitnessSession.aggregate([...]);

// const taggedSports = sportsResults.map(s => ({ ...s, sessionModel: 'SPORTS_SESSION' }));
// const taggedFitness = fitnessResults.map(s => ({ ...s, sessionModel: 'FITNESS_SESSION' }));

// const merged = [...taggedSports, ...taggedFitness];

// // optional: sort merged by relevance score or createdAt before sending
// res.json({ sessions: merged });
}
