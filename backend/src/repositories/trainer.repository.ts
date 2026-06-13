import { ITrainerProfile } from '@/models/trainerProfile.model';
import { BaseRepository } from './base.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { FilterQuery, Model, Types } from 'mongoose';

export class TrainerRepository
  extends BaseRepository<ITrainerProfile>
  implements ITrainerRepository
{
  constructor(model: Model<ITrainerProfile>) {
    super(model);
  }  
  async findAll(query:FilterQuery<ITrainerProfile>,options: { skip:number, limit:number }){
      return await this.model.find(query)
      .populate('userId','_id name email')
      .sort({createdAt:-1})
      .skip(options.skip)
      .limit(options.limit);
  }
  async findByUserId(userId: Types.ObjectId | string): Promise<ITrainerProfile> {
    return await this.model.findOne({ userId: userId });
    
  }
}
