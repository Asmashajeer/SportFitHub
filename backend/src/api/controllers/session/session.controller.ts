
import { PAYLOAD_MODEL} from '@/constants/enums';
import { STATUS_CODE, SUCCESS_MESSAGES } from '@/constants/messages';
import { IFitnessSessionService } from '@/interfaces/services/session/IFitness.session.service ';
import { ISportsSessionService } from '@/interfaces/services/session/ISports.session.service';



import { NextFunction, Request, Response } from 'express';

export class SessionController {
    private _sportSessionService: ISportsSessionService;
    private _fitnessSessionService: IFitnessSessionService;    
  constructor(sportSessionService: ISportsSessionService,fitnessSessionService: IFitnessSessionService) {
    this._fitnessSessionService = fitnessSessionService;
    this._sportSessionService=sportSessionService
  }

//-----------------------------------fetching booking  payload session Data- ------
  getSessionDetails=async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try{
        const { sessionModel, id } = req.params;
       
        if(sessionModel===PAYLOAD_MODEL.SPORT_SESSION){
          const  session=await this._sportSessionService.getASession(id);
          res.status(STATUS_CODE.SUCCESS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.GENERAL.FETCHED,
            session, 
          })
        }else if(sessionModel===PAYLOAD_MODEL.FITNESS_SESSION){
           const  session=await this._fitnessSessionService.getASession(id);
           res.status(STATUS_CODE.SUCCESS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.GENERAL.FETCHED,
            session, 
          })
        }
    } catch (error) {
      next(error);
    }
  }


  
};
