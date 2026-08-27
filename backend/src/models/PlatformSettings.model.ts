import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformSettings extends Document {
  commissionPercent: number;
  payoutHoldHours: number;
  cancellationPenaltyPercent: number;
  strikeResetDays: number;
  updatedAt: Date;
}

const PlatformSettingsSchema = new Schema<IPlatformSettings>(
  {
    commissionPercent: { type: Number, required: true, default: 20 },
    payoutHoldHours: { type: Number, required: true, default: 48 },
    cancellationPenaltyPercent: { type: Number, required: true, default: 15 },
    strikeResetDays: { type: Number, required: true, default: 90 },
  },
  { timestamps: true }
);

export default mongoose.model<IPlatformSettings>('PlatformSettings', PlatformSettingsSchema);