import { IPayment } from '@/models/payment.model';
import { ClientSession } from 'mongoose';
import { IBaseRepository } from './IBase.repository';
import { FilterQuery } from 'mongoose';
import { PAYMENT_STATUS } from '@/constants/enums';

export interface IPaymentRepository extends IBaseRepository<IPayment> {
  createPayment(data: Partial<IPayment>, session: ClientSession);
  updatePayment(id: string, data: Partial<IPayment>, session: ClientSession);
  findByUserId(filter: FilterQuery<IPayment>): Promise<IPayment[] | null>;
  findAllPayments(filter: FilterQuery<IPayment>, options: { skip: number; limit: number } ): Promise<IPayment[] | null>
  sumByStatus(status:PAYMENT_STATUS,dateRange:{startDate:Date,endDate:Date}):Promise<number>
}
