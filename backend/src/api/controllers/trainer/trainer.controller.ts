import { DOC_VERIFY_STATUS } from "@/constants/enums";
import { MESSAGES, STATUS_CODE } from "@/constants/messages";
import { ITrainerService } from "@/interfaces/services/trainer/Itrainer.service";
import { IUser } from "@/models/user.model";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {Request,Response, NextFunction } from "express";

export class TrainerController{
    private _trainerService:ITrainerService;

    constructor(trainerService:ITrainerService){
        this._trainerService=trainerService;

    }

    addProfile=async(req:Request,res:Response,next:NextFunction):Promise<void> =>{
        try{
            const user=req.user as IUser
            const userId=user.id;
            await this._trainerService.checkExistingProfile(userId);          

                const profile={
                    userId,
                    ...req.body
                }
             const result=await this._trainerService.addProfile(profile);
             res.status(STATUS_CODE.CREATED).json({
                success:true,
                message:MESSAGES.success.PROFILE_CREATED,
                profileData:result
             })
        }
        catch(error){
            next(error);
        }    
    }
   
}