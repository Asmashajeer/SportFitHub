import { Types } from 'mongoose';

import { IPayoutLedger } from '@/models/payoutLedger.model';
import { IBaseRepository } from './IBase.repository';
import { BookingSession_Price } from '@/dtos/request/booking/booking.request.dto';

export interface IPayoutLedgerRepository extends IBaseRepository<IPayoutLedger> {
  createFromBookingSession(bookingSession: BookingSession_Price, commissionPercent: number, holdHours: number): Promise<IPayoutLedger> 
  releaseExpiredHolds(): Promise<{ modifiedCount: number }>
  getBalanceSummary(trainerId: string)
  findByTrainerPaginated(trainerId: string, page: number);
  getDistinctPayableTrainerIds():Promise<Types.ObjectId[]>






  findPayableByTrainer(trainerId: string): Promise<IPayoutLedger[]>;
  markPaidBulk(ids: Types.ObjectId[]): Promise<void>; 

  voidByBookingSessionId(bookingSessionId: string): Promise<void>;

  findByBookingSessionId(bookingSessionId: string): Promise<IPayoutLedger | null>;
  sumPayableAcrossAllTrainers():Promise<number>
}