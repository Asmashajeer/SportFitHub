import { PAYOUT_LEDGER_STATUS, PayoutLedgerStatus } from '@/constants/enums';
import mongoose, { Document, Schema, Types } from 'mongoose';



export interface IPayoutLedger extends Document {
  _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  bookingSessionId: Types.ObjectId;
  sessionId: Types.ObjectId;
  slotId: string;
  startDateTime: Date;
  sessionRevenue: number;
  commissionPercent: number;
  trainerShare: number;
  status: PayoutLedgerStatus;
  holdReleaseAt: Date | null;
  createdAt: Date;
}

const PayoutLedgerSchema = new Schema<IPayoutLedger>(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: 'TrainerProfile', required: true },
    bookingSessionId: { type: Schema.Types.ObjectId, ref: 'BookingSession', required: true },
    sessionId: { type: Schema.Types.ObjectId,required: true },
    slotId: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    sessionRevenue: { type: Number, required: true },
    commissionPercent: { type: Number, required: true },
    trainerShare: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(PAYOUT_LEDGER_STATUS),
        default: PAYOUT_LEDGER_STATUS.PENDING_HOLD,
        required: true,
    },
    holdReleaseAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PayoutLedgerSchema.index({ bookingSessionId: 1 }, { unique: true });
PayoutLedgerSchema.index({ trainerId: 1, status: 1 });
PayoutLedgerSchema.index({ status: 1, holdReleaseAt: 1 });

export default mongoose.model<IPayoutLedger>('PayoutLedger', PayoutLedgerSchema);