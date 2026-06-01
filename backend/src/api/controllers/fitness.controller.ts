import { STATUS_CODE, SUCCESS_MESSAGES } from "@/constants/messages";
import { IFitnessService } from "@/interfaces/services/Ifitness.service";



import { NextFunction, Request, Response } from "express";

export class FitnessController{
   
    private _fitnessService:IFitnessService;
    constructor (fitnessService:IFitnessService){      
        this._fitnessService=fitnessService
    }


    
    getAvailableFitnessPrograms=async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const fitnessPgms=await this._fitnessService.getActiveFitnessPrograms()
            res.status(STATUS_CODE.SUCCESS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.GENERAL.FETCHED,
                fitnessPgms
            })
        }
        catch(error){
            next(error);
        }
    }

}