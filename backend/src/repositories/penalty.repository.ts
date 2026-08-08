import { ITrainerProfile } from '@/models/trainerProfile.model';
import { PenaltyRequestData } from '@/dtos/request/trainer/trainer.penalty.request.dto';
import { BaseRepository } from './base.repository';
import { IPenaltyRepository } from '@/interfaces/repositories/IPenalty.repository';
import { Model } from 'mongoose';


export class PenaltyRepository extends BaseRepository<ITrainerProfile> implements IPenaltyRepository {
  constructor(model: Model<ITrainerProfile>) {
    super(model);
  }

  async findTrainerById(trainerId: string): Promise<ITrainerProfile> {
    return await this.model.findById(trainerId);
  }

  async updatePenalty(trainerId: string, updateData: PenaltyRequestData): Promise<ITrainerProfile> {
    return await this.model.findByIdAndUpdate(trainerId, updateData);
  }
  async incrementStrike(trainerId: string, { strikePoints, cancellationCount, lastStrikeDate }: { strikePoints: number; cancellationCount: number; lastStrikeDate: Date }) {
    return this.model.findByIdAndUpdate(trainerId, { $inc: { strikePoints, cancellationCount }, $set: { lastStrikeDate } }, { new: true });
  }
}
