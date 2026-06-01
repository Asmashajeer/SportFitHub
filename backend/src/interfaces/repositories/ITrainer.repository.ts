import { ITrainerProfile } from '@/models/trainerProfile.model';
import { IBaseRepository } from './IBase.repository';
import { Types } from 'mongoose';
import { FilterQuery } from 'mongoose';

export interface ITrainerRepository extends IBaseRepository<ITrainerProfile> {
  findAll(query:FilterQuery<ITrainerProfile>,options: { skip:number, limit:number })
  findByUserId(userId: Types.ObjectId | string): Promise<ITrainerProfile>;
}
