import { IWalletTransaction } from '@/models/wallet.transaction.model';
import { ClientSession, Model, Types } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IWalletTransactionRepository } from '@/interfaces/repositories/IWallet.transaction.repository';

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
}
