
import { Model, Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IPenaltyLedger } from '@/models/penaltyLedger.model';
import { IPenaltyLedgerRepository } from '@/interfaces/repositories/IPenaltyLedger.repository';
import { PENALTY_STATUS } from '@/constants/enums';

export class PenaltyLedgerRepository extends BaseRepository<IPenaltyLedger> implements IPenaltyLedgerRepository {
  constructor(model: Model<IPenaltyLedger>) {
    super(model);
  }
  async findByOccurrence(sessionId: string, slotId: string, startDateTime: Date): Promise<IPenaltyLedger | null> {
    return this.model.findOne({ sessionId, slotId, startDateTime });
  }

  async createPenalty(data: { trainerId: string; sessionId: string; slotId: string; startDateTime: Date; amount: number; reason: string; status: 'pending' }): Promise<IPenaltyLedger> {
    return this.model.create(data);
  }

  async findPendingByTrainer(trainerId: string): Promise<IPenaltyLedger[]> {
    return this.model.find({ trainerId, status: 'pending' });
  }


   async markDeductedBulk(ids: Types.ObjectId[]): Promise<void> {
      await this.model.updateMany({ _id: { $in: ids } }, { status: PENALTY_STATUS.DEDUCTED});
    }
// async markDeducted(): Promise<void> {
  //   await this.model.updateOne({ sessionId, slotId, startDateTime }, { status: 'deducted' });
  // }


}
