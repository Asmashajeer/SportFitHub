import { DOC_VERIFY_STATUS, TRAINER_STATUS } from "@/constants/enums";
import { MESSAGES, STATUS_CODE } from "@/constants/messages";
import { trainerStatusDTO } from "@/dtos/request/admin/admin.trainer.dto";
import { TrainerProfileResponseDTO } from "@/dtos/response/trainer/trainer.response.dto";
import { PendingTrainersBasicDTO, TrainerProfileDTO } from "@/dtos/response/trainer/trainerApprovals.response";
import { ITrainerRepository } from "@/interfaces/repositories/ITrainer.repository";
import { ITrainerService } from "@/interfaces/services/trainer/Itrainer.service";
import { toPendingTrainersBasicData, toTrainerProfileData, ToTrainerProfileDTO } from "@/mappers/trainer/trainer.mapper";
import { ITrainerProfile } from "@/models/trainerProfile.model";
import AppError from "@/utils/AppError";
import { Types } from "mongoose";

export class TrainerService implements ITrainerService{
    private _trainerRepo:ITrainerRepository
    constructor(trainerRepo:ITrainerRepository){
        this._trainerRepo=trainerRepo;
    }

    async checkExistingProfile(userId:Types.ObjectId):Promise<void>{
         const existingProfile=await this._trainerRepo.findByUserId(userId) 
        if(existingProfile)  throw new AppError(MESSAGES.error.PROFILE_EXISTS,STATUS_CODE.CONFLICT)  ;
    }

    async addProfile(profileData: Partial<ITrainerProfile>): Promise<TrainerProfileResponseDTO> {   
          await this.checkExistingProfile(profileData.userId);    
        const data=await this._trainerRepo.create(profileData);  
       
        const profile:TrainerProfileResponseDTO=toTrainerProfileData(data);
        return profile;
    }
    async getPendingTrainers():Promise<PendingTrainersBasicDTO[]>{
        const pendingTrainers=await this._trainerRepo.find({status:{$in:[TRAINER_STATUS.SUBMITTED,TRAINER_STATUS.UNDER_REVIEW]}})
        // const certCount=pendingTrainers
        const pendingTrainersBasicData:PendingTrainersBasicDTO[]=pendingTrainers.map(trainer=>(toPendingTrainersBasicData(trainer)));
        return pendingTrainersBasicData;
    }
    async getTrainer(id:string|Types.ObjectId):Promise<TrainerProfileDTO>{
           const trainer= await this._trainerRepo.findById(id);
           if(!trainer) throw new AppError(MESSAGES.trainer.error.TRAINER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
           const trainerData:TrainerProfileDTO=ToTrainerProfileDTO(trainer);
           return  trainerData;
    }
    async updateFileStatus(id:string|Types.ObjectId,targetField:'certificationInfo' | 'idVerification',status:string,reason:string):Promise<TrainerProfileDTO>{
        const trainer=await this._trainerRepo.findById(id);
        if(!trainer) throw new AppError(MESSAGES.trainer.error.TRAINER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
      
        const updateData: any = {
            [`${targetField}.status`]: status,
            [`${targetField}.rejectReason`]: status === DOC_VERIFY_STATUS.REJECTED ? reason : "",
        };

 
        if (status === 'verified') {
            updateData[`${targetField}.verified`] = true;
            updateData[`${targetField}.verifiedAt`] = new Date().toISOString();
        } else {
            updateData[`${targetField}.verified`] = false;
        }
        
        const updatedData =await this._trainerRepo.findOneAndUpdate(id,{$set:updateData})
         const trainerData:TrainerProfileDTO=ToTrainerProfileDTO(updatedData);
        return trainerData;
    }


    async updateTrainerStatus(id:string|Types.ObjectId,status:TRAINER_STATUS,reason:string):Promise<TrainerProfileDTO>{
        const trainer=await this._trainerRepo.findById(id);
        if(!trainer) throw new AppError(MESSAGES.trainer.error.TRAINER_NOT_FOUND,STATUS_CODE.NOT_FOUND);
      
       const updateData:trainerStatusDTO = {
            status: status,
        };

        
        if (status === TRAINER_STATUS.REJECTED) {
            updateData.rejectionReason = reason || ""; 
            updateData.rejectedAt = new Date();      
          
        }

        
        const updatedDoc = await this._trainerRepo.findOneAndUpdate(
            id, 
            { $set: updateData }        
        );

        if (!updatedDoc) {
            throw new AppError("Update failed", STATUS_CODE.INTERNAL_SERVER_ERROR);
        }

        const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
        return trainerData;

        }
    }