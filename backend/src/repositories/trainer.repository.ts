import { ITrainerProfile } from '@/models/trainerProfile.model';
import { BaseRepository } from './base.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { Model, Types } from 'mongoose';

export class TrainerRepository
  extends BaseRepository<ITrainerProfile>
  implements ITrainerRepository
{
  constructor(model: Model<ITrainerProfile>) {
    super(model);
  }

  async findByUserId(userId: Types.ObjectId | string): Promise<ITrainerProfile> {
    return await this.model.findOne({ userId: userId });
  }
}
