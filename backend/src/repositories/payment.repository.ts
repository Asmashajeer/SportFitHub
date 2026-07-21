import { ClientSession, FilterQuery } from 'mongoose';
import { IPayment } from '../models/payment.model';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';

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
}
