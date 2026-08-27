import { Model, Types } from 'mongoose';
import { IPayoutLedger } from '@/models/payoutLedger.model';
import { PAGINATION_LIMIT, PAYOUT_LEDGER_STATUS } from '@/constants/enums';
import { IPayoutLedgerRepository } from '@/interfaces/repositories/IPayoutLedger.repository';
import { BaseRepository } from './base.repository';
import { BookingSession_Price } from '@/dtos/request/booking/booking.request.dto';

export class PayoutLedgerRepository extends BaseRepository<IPayoutLedger> implements IPayoutLedgerRepository {
    constructor(model: Model<IPayoutLedger>) {
        super(model);
      }

      //-------------create payoutLedger--------------
  async createFromBookingSession(bookingSession: BookingSession_Price, commissionPercent: number, holdHours: number): Promise<IPayoutLedger> {
     
    const trainerShare = bookingSession.unitPrice * (1 - commissionPercent / 100);
    const holdReleaseAt = new Date(Date.now() + holdHours * 60 * 60 * 1000);
    
    return this.model.create({
      trainerId: bookingSession.trainerId,
      bookingSessionId: bookingSession.id,
      sessionId: bookingSession.sessionId,
      slotId: bookingSession.slotId,
      startDateTime: bookingSession.startDateTime,
      sessionRevenue: bookingSession.unitPrice,
      commissionPercent,
      trainerShare,
      status: PAYOUT_LEDGER_STATUS.PENDING_HOLD,
      holdReleaseAt,
    });
  }


  //------release paypout-hold--
   async releaseExpiredHolds(): Promise<{ modifiedCount: number }>{
   return await this.model.updateMany(
      {
        status: PAYOUT_LEDGER_STATUS.PENDING_HOLD,
        holdReleaseAt: { $lte: new Date() },
      },
      { status: PAYOUT_LEDGER_STATUS.PAYABLE }
    );
  }


    //------------- Balance Summary------
  async getBalanceSummary(trainerId: string) {
    const rows = await this.model.find({ trainerId });
    const pendingHold = rows.filter(r => r.status === 'pending_hold').reduce((s, r) => s + r.trainerShare, 0);
    const payable = rows.filter(r => r.status === 'payable').reduce((s, r) => s + r.trainerShare, 0);
    const paid = rows.filter(r => r.status === 'paid').reduce((s, r) => s + r.trainerShare, 0);
    return { pendingHold, payable, paid };
  }

  async findByTrainerPaginated(trainerId: string, page: number) {
    return this.model.find({ trainerId })
      .sort({ startDateTime: -1 })
      .skip((page - 1) *PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT);
  }

  async getDistinctPayableTrainerIds():Promise<Types.ObjectId[]>{
    return this.model.distinct('trainerId');
      
  }




  //-----------find payable entrees---
  async findPayableByTrainer(trainerId: string): Promise<IPayoutLedger[]> {
    return this.model.find({
      trainerId,
      status: PAYOUT_LEDGER_STATUS.PAYABLE,
    });
  }

  async markPaidBulk(ids: Types.ObjectId[]): Promise<void> {
    await this.model.updateMany({ _id: { $in: ids } }, { status: PAYOUT_LEDGER_STATUS.PAID });
  }

 
  async voidByBookingSessionId(bookingSessionId: string): Promise<void> {
    await this.model.updateOne(
      {
        bookingSessionId,
        status: { $in: [PAYOUT_LEDGER_STATUS.PENDING_HOLD, PAYOUT_LEDGER_STATUS.PAYABLE] },
      },
      { status: PAYOUT_LEDGER_STATUS.VOID }
    );
  }

  async findByBookingSessionId(bookingSessionId: string): Promise<IPayoutLedger | null> {
    return this.model.findOne({ bookingSessionId });
  }

async sumPayableAcrossAllTrainers():Promise<number>{
      const result=await this.model.aggregate([
        {$match:{status:PAYOUT_LEDGER_STATUS.PAYABLE}},
        {$group:{_id:null,total:{$sum:'$trainerShare'}}}
      ]);
      return result[0]?.total ?? 0;
    }

 
}
