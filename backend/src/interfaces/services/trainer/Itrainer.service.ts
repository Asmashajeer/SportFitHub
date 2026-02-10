import { TRAINER_STATUS } from "@/constants/enums";
import { TrainerProfileResponseDTO } from "@/dtos/response/trainer/trainer.response.dto";
import { PendingTrainersBasicDTO, TrainerProfileDTO } from "@/dtos/response/trainer/trainerApprovals.response";
import { ITrainerProfile } from "@/models/trainerProfile.model";
import { Types } from "mongoose";

export interface ITrainerService{
    checkExistingProfile(userId:Types.ObjectId):Promise<void>
    addProfile(profileData:Partial<ITrainerProfile>):Promise<TrainerProfileResponseDTO>
    getPendingTrainers():Promise<PendingTrainersBasicDTO[]>
    getTrainer(id:string):Promise<TrainerProfileDTO>
    updateFileStatus(id:string|Types.ObjectId,targetField:'certificationInfo' | 'idVerification',status:string,reason:string):Promise<TrainerProfileDTO>
     updateTrainerStatus(id:string|Types.ObjectId,status:TRAINER_STATUS,reason:string):Promise<TrainerProfileDTO>
}