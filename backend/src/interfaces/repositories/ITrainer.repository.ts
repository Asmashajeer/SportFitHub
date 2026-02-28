import { ITrainerProfile } from '@/models/trainerProfile.model';
import { IBaseRepository } from './IBase.repository';
import { Types } from 'mongoose';

export interface ITrainerRepository extends IBaseRepository<ITrainerProfile> {
  findByUserId(userId: Types.ObjectId | string): Promise<ITrainerProfile>;
}
