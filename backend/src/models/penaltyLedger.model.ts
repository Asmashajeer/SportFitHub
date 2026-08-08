import { PENALTY_REASONS, PENALTY_STATUS } from '@/constants/enums';
import { Schema, model, Types, Document } from 'mongoose';


export interface IPenaltyLedger extends Document {
  _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  sessionId: Types.ObjectId;
  slotId: string;
  startDateTime: Date;
  amount: number;
  reason: PENALTY_REASONS;
  status: PENALTY_STATUS;
  createdAt: Date;
}



const PenaltyLedgerSchema = new Schema<IPenaltyLedger>(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: 'TrainerProfile', required: true },
    sessionId: { type: Schema.Types.ObjectId, required: true },
    slotId: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    amount: { type: Number, required: true },
   reason: {
      type: String,
      enum: Object.values(PENALTY_REASONS),
      required: true,
    },
    status: { type: String, enum: Object.values(PENALTY_STATUS),
      default: PENALTY_STATUS.PENDING, },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// prevents double-penalizing the same cancelled occurrence
PenaltyLedgerSchema.index({ sessionId: 1, slotId: 1, startDateTime: 1 }, { unique: true });

export const PenaltyLedgerModel = model<IPenaltyLedger>('PenaltyLedger', PenaltyLedgerSchema);