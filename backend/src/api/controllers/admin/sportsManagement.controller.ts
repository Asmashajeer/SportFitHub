import {  ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from "@/constants/messages";
import { ISportsManagementService } from "@/interfaces/services/admin/ISportsManagementService";
import AppError from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";


export class SportsManagementController{
    private _sportsManagementService:ISportsManagementService;
    constructor(sportsManagementService:ISportsManagementService){
        this._sportsManagementService=sportsManagementService;
    }

  addSport= async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        
        const sport=req.body;        
        try{
            const newSport=await this._sportsManagementService.addSports(sport);
            res.status(STATUS_CODE.SUCCESS.CREATED).json({
                success:true,
                message:SUCCESS_MESSAGES.SPORT.SPORT_ADDED,
                newSport
            })
        }
        catch(error){
            next(error);
        }
    }


     getAllSports= async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const page = parseInt(req.query.page as string) || 1;
        const search = req.query.search as string;
        const status = req.query.status as string ;     
      
        try{
            const sports=await this._sportsManagementService.getSports({page,search,status});
            
           
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

    toggleSportStatus=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const id=req.params.id;
        try{
            const sport=await this._sportsManagementService.toggleSportStatus(id);
            res.status(STATUS_CODE.SUCCESS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.SPORT.SPORT_STATUS_TOGGLE+sport.isActive,
                sport
            })
        }
        catch(error){
            next(error);
        }

    }


     updateSport=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const id=req.params.id;
        
       const sportData=req.body;
        try{
            const sport=await this._sportsManagementService.updateSport(id,sportData);
            res.status(STATUS_CODE.SUCCESS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.GENERAL.UPDATED,
                sport
            })
        }
        catch(error){
            next(error);
        }

    }
  deleteSport=async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const id=req.params.id;
        try{
            const result=await this._sportsManagementService.deleteSport(id);
            if(!result)
                throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND)
            res.status(STATUS_CODE.SUCCESS.OK).json({
                success:true,
                message:`Sport`+SUCCESS_MESSAGES.GENERAL,
                id
            })
        }
        catch(error){
            next(error);
        }

    }
    
}