import { IWalletTransaction } from '@/models/wallet.transaction.model';
import { IBaseRepository } from './IBase.repository';
import { ClientSession, Types } from 'mongoose';

export interface IWalletTransactionRepository extends IBaseRepository<IWalletTransaction> {
  createTransaction(data: Partial<IWalletTransaction>, session: ClientSession);
  findTransaction(userId: string | Types.ObjectId);
  sumRefunds(dateRange:{startDate:Date,endDate:Date}):Promise<number>
}
