import { STATUS_CODE } from "@/constants/messages";
import { ITrainerEarningsService } from "@/interfaces/services/trainer/ITrainer.earnings.service";
import {Request,  Response,NextFunction} from "express";

export class TrainerEarningsController {
  private _trainerEarningsService: ITrainerEarningsService;
  constructor(trainerEarningsService: ITrainerEarningsService) {
    this._trainerEarningsService = trainerEarningsService;
  }


  getEarningsSummary= async (req: Request, res: Response, next: NextFunction):Promise<void> => {
      const trainerId = req.query.trainerId as string;      
    
      try {
       const earnings= await this._trainerEarningsService.getEarningsSummary( trainerId);
        res.status(STATUS_CODE.SUCCESS.OK).json(earnings);
      } catch (error) {
        next(error);
      }
    };


    getSessionEarnings= async (req: Request, res: Response, next: NextFunction):Promise<void> => {
      const trainerId = req.query.trainerId as string; 
      const page=  parseInt( req.query.page as string); 
    
      try {
             const sessionsData=await this._trainerEarningsService.getSessionEarnings(trainerId, page);
              res.status(STATUS_CODE.SUCCESS.OK).json({sessionsData});
      } catch (error) {
        next(error);
      }
    };

    getPayoutHistory= async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        const trainerId = req.query.trainerId as string;      
        
        try {
        const history= await this._trainerEarningsService.getPayoutHistory( trainerId);
            res.status(STATUS_CODE.SUCCESS.OK).json(history);
        } catch (error) {
            next(error);
        }
        };
  
}