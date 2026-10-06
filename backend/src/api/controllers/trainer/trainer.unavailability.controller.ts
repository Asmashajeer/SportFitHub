import { STATUS_CODE } from '@/constants/messages';
import { ITrainerUnavailabilityService } from '@/interfaces/services/trainer/ITrainerUnavailability.service';
import { AuthRequest } from '@/middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';

export class TrainerUnavailabilityController {
  private _trainerUnavailabilityService: ITrainerUnavailabilityService;

    constructor(trainerUnavailabilityService: ITrainerUnavailabilityService) {
        this._trainerUnavailabilityService = trainerUnavailabilityService;
    }

    CancelAvailability=async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId=req.user.id;
            const {date,reason}=req.body;
            await this._trainerUnavailabilityService.cancelAvailability(userId,{date,reason});
        res.status(STATUS_CODE.SUCCESS.CREATED).json({ message: `${date} marked unavailable` });
        }
        catch(err){
            next(err);
        }
    }


 restoreAvailability=async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
             const userId=req.user.id;
           const date= req.params.date
            await this._trainerUnavailabilityService.restoreAvailability(userId,date);
            res.status(STATUS_CODE.SUCCESS.OK).json({ message: `${date} Day restored" }` });
        }
        catch(err){
            next(err);
        }
    }
getUnAvailabileDays=async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
           const userId=req.user.id; ;
            const days=await this._trainerUnavailabilityService.getUnavailability(userId);
            res.status(STATUS_CODE.SUCCESS.OK). json(days);
        }
        catch(err){
            next(err);
        }
    }


    getUnavailableDates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dates = await this._trainerUnavailabilityService.getPublicUnavailableDates(req.params.trainerId);
            res.status(STATUS_CODE.SUCCESS.OK).json(dates);
        } catch (err) {
             next(err);
         }
    };
    
}