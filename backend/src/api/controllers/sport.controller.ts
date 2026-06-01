import { STATUS_CODE, SUCCESS_MESSAGES } from "@/constants/messages";
import { ISportsService } from "@/interfaces/services/Isports.service";


import { NextFunction, Request, Response } from "express";

export class SportsController{
   
    private _sportsService:ISportsService;
    constructor (sportsService:ISportsService){      
        this._sportsService=sportsService
    }


    
    getAvailableSports=async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const sports=await this._sportsService.getActiveSports()
            res.status(STATUS_CODE.SUCCESS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.GENERAL.FETCHED,
                sports
            })
        }
        catch(error){
            next(error);
        }
    }

}