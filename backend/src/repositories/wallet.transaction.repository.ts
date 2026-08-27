import { IWalletTransaction } from '@/models/wallet.transaction.model';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IWalletTransactionRepository } from '@/interfaces/repositories/IWallet.transaction.repository';
import { TRANSACTION_REASON } from '@/constants/enums';

export class WalletTransactionRepository extends BaseRepository<IWalletTransaction> implements IWalletTransactionRepository {
  constructor(model: Model<IWalletTransaction>) {
    super(model);
  }
  async createTransaction(data: Partial<IWalletTransaction>, session: ClientSession) {
    const [transaction] = await this.model.create([data], { session });
    return transaction;
  }
  async findTransaction(userId: string | Types.ObjectId) {
    const transaction = await this.model.find({ userId: userId });
    return transaction;
  }
  async sumRefunds(dateRange:{startDate:Date,endDate:Date}):Promise<number>{
    const match:FilterQuery<IWalletTransaction>={reason:TRANSACTION_REASON.REFUND};
    if (dateRange) {
      match.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }
    const result=await this.model.aggregate([
      {$match:match},
      {$group:{_id:null,total:{$sum:'$amount'}}}
    ]);
    return result[0]?.total ?? 0;
  }
}
