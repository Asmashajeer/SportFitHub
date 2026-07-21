import { ITrainerProfile } from '@/models/trainerProfile.model';
import { IBaseRepository } from './IBase.repository';
import { PenaltyRequestData } from '@/dtos/request/trainer/trainer.penalty.request.dto';

export interface IPenaltyRepository extends IBaseRepository<ITrainerProfile> {
  findTrainerById(trainerId: string): Promise<ITrainerProfile>;
  updatePenalty(trainerId: string, updateData: PenaltyRequestData): Promise<ITrainerProfile>;
}
