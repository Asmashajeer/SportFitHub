import { ClientSession, FilterQuery } from 'mongoose';
import { IPayment } from '../models/payment.model';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { PAYMENT_STATUS } from '@/constants/enums';


export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor(model: Model<IPayment>) {
    super(model);
  }
  async createPayment(data: Partial<IPayment>, session: ClientSession) {
    // Note: When using sessions, .create() must take an array
    const [payment] = await this.model.create([data], { session });
    return payment;
  }

  async updatePayment(id: string, data: Partial<IPayment>, session: ClientSession) {
    return await this.model.findByIdAndUpdate(id, data, { session, new: true });
  }

  async findByUserId(filter: FilterQuery<IPayment>): Promise<IPayment[] | null> {
    return await this.model.find(filter);
    // .populate('paymentId' ,'_id receiptUrl' );
  }
  async findAllPayments(filter: FilterQuery<IPayment> = {}, options: { skip: number; limit: number } ): Promise<IPayment[] | null> {
       return await this.model.find(filter)
       .sort({ createdAt: -1 })
       .skip(options?.skip)
       .limit(options?.limit)
       .exec();
     }

  async sumByStatus(status:PAYMENT_STATUS,dateRange:{startDate:Date,endDate:Date}):Promise<number>{
    const match:FilterQuery<IPayment>={status};
    if (dateRange) {
      match.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
    }

    const result= await this.model.aggregate([
      {$match:match},
      {$group:{_id:null,total:{$sum:'$amount'}}}
    ]);
    return result[0]?.total ?? 0;
  }
}


