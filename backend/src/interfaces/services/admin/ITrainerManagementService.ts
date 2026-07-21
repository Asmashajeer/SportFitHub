import { TRAINER_STATUS } from '@/constants/enums';
import { TrainerFilterRequestDTO } from '@/dtos/request/admin/admin.trainer.dto';
import { AdminTrainersDTOWithPagination, TrainerProfileDTOPopulatedUser } from '@/dtos/response/admin/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { PendingTrainersBasicDTO } from '@/dtos/response/admin/trainer.response.dto';
import { AuthUser } from '@/middleware/auth.middleware';

import { Types } from 'mongoose';

export interface ITrainerManagementService {
  getTrainers(filter: TrainerFilterRequestDTO, user: AuthUser): Promise<AdminTrainersDTOWithPagination>;
  getPendingTrainers(user: AuthUser): Promise<PendingTrainersBasicDTO[]>;
  // trainerDetailsById(id: string | Types.ObjectId,user:AuthUser): Promise<TrainerProfileDTO>;
  trainerDetailsById(id: string, user: AuthUser): Promise<TrainerProfileDTOPopulatedUser>;
  trainerDetailsByUserId(user: AuthUser): Promise<TrainerProfileDTO>;
  updateFileStatus(id: string | Types.ObjectId, targetField: 'certificationInfo' | 'idVerification', status: string, reason: string, user: AuthUser): Promise<TrainerProfileDTO>;
  updateTrainerStatus(id: string | Types.ObjectId, status: TRAINER_STATUS, reason: string, user: AuthUser): Promise<TrainerProfileDTO>;
}
