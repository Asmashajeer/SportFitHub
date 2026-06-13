import { ITrainerProfile } from "@/models/trainerProfile.model";
import { TrainerRepository } from "./trainer.repository";
import { TRAINER_STATUS } from "@/constants/enums";
import { PenaltyRequestData, TrainerProfilewithPopulatedUser } from "@/dtos/request/trainer/trainer.penalty.request.dto";
import { BaseRepository } from "./base.repository";
import { IPenaltyRepository } from "@/interfaces/repositories/IPenalty.repository";
import { Model } from "mongoose";

export class PenaltyRepository extends BaseRepository<ITrainerProfile>  implements IPenaltyRepository {
    constructor(model: Model<ITrainerProfile>) {
       super(model);
     }
  

  async findTrainerById(trainerId: string): Promise<ITrainerProfile> {
    return await this.model.findById(trainerId).populate('userId');
  }

  async updatePenalty(    trainerId: string,    updateData: PenaltyRequestData  ): Promise<ITrainerProfile> {
    return await this.model.findByIdAndUpdate(trainerId, updateData);
  }
}