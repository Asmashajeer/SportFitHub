import mongoose, { Document, Schema, Types } from 'mongoose';
import { PAYOUT_BATCH_STATUS, PayoutBatchStatus } from '@/constants/enums';

export interface IPayoutBatch extends Document {
  _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  earningsTotal: number;
  penaltyTotal: number;
  netAmount: number;
  status:PayoutBatchStatus;
  stripeTransferId?: string;
  failureReason?: string;
  sessionCount: number;
  penaltyCount: number;
  runAt: Date;
  createdAt: Date;
}

const PayoutBatchSchema = new Schema<IPayoutBatch>(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: 'TrainerProfile', required: true },
    earningsTotal: { type: Number, required: true },
    penaltyTotal: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(PAYOUT_BATCH_STATUS),
      required: true,
    },
    stripeTransferId: { type: String },
    failureReason: { type: String },
    sessionCount: { type: Number, required: true },
    penaltyCount: { type: Number, required: true },
    runAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PayoutBatchSchema.index({ trainerId: 1, runAt: -1 }); // trainer's payout history, most recent first
PayoutBatchSchema.index({ status: 1, runAt: -1 });     // admin: find all failed/skipped runs quickly

export default mongoose.model<IPayoutBatch>('PayoutBatch', PayoutBatchSchema);