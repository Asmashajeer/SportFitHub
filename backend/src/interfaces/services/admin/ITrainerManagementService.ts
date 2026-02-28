import { TRAINER_STATUS } from '@/constants/enums';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { PendingTrainersBasicDTO } from '@/dtos/response/trainer/trainerApprovals.response';

import { Types } from 'mongoose';

export interface ITrainerManagementService {
  getPendingTrainers(): Promise<PendingTrainersBasicDTO[]>;
  trainerDetailsById(id: string | Types.ObjectId): Promise<TrainerProfileDTO>;
  trainerDetailsByUserId(userId: string | Types.ObjectId): Promise<TrainerProfileDTO>;
  updateFileStatus(
    id: string | Types.ObjectId,
    targetField: 'certificationInfo' | 'idVerification',
    status: string,
    reason: string
  ): Promise<TrainerProfileDTO>;
  updateTrainerStatus(
    id: string | Types.ObjectId,
    status: TRAINER_STATUS,
    reason: string
  ): Promise<TrainerProfileDTO>;
}
