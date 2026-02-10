import { MESSAGES, STATUS_CODE } from "@/constants/messages";
import { ITrainerService } from "@/interfaces/services/trainer/Itrainer.service";
import AppError from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";

export class TrainerApprovalsController{
   
    private _trainerService:ITrainerService;
    constructor(trainerService:ITrainerService){
        this._trainerService=trainerService;
    }
    getAllPendingTrainers=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            const pendingTrainers= await this._trainerService.getPendingTrainers();
            if (!pendingTrainers || pendingTrainers.length === 0) {            
            res.status(STATUS_CODE.OK).json({
                success: true,
                message: "No pending trainers found",
                pendingTrainers: [] 
            });
            return; 
        }
            res.status(STATUS_CODE.OK).json({
                success:true, 
                message:"Pending Trainers",               
                pendingTrainers
            })
         }
        catch(error){
            next(error)
        }
    }



    // Get a trainer
    getTrainer=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        const id=req.params.id;
        try{
            const trainerData=await this._trainerService.getTrainer(id);
            res.status(STATUS_CODE.OK).json({
                success:true,
                message:MESSAGES.trainer.success.TRAINER_FETCH_SUCCESS,
                trainerData
            })
        }       
    
        catch(error){
            next(error)
        }   
    } 
     updateFileStatus=async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
        
        const{id,targetField,status,reason}=req.body;
        try{
            const trainerData=await this._trainerService.updateFileStatus(id,targetField,status,reason)
            res.status(STATUS_CODE.OK).json({
                success:true,
                message:MESSAGES.trainer.success.TRAINER_DOC_STATUS_UPDATED,
                trainerData
            })
        }
        catch(error){
            next(error)
        }
    }
     updateTrainerStatus=async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
        
        const{id,status,reason}=req.body;
        try{
            const trainerData=await this._trainerService.updateTrainerStatus(id,status,reason)
            res.status(STATUS_CODE.OK).json({
                success:true,
                message:MESSAGES.trainer.success.TRAINER_DOC_STATUS_UPDATED,
                trainerData
            })
        }
        catch(error){
            next(error)
        }
    }
}