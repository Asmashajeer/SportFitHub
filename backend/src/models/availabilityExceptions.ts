import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAvailabilityException extends Document {
  trainerId: Types.ObjectId; // TrainerProfile _id
  date: Date; 
  reason:string;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilityExceptionSchema = new Schema<IAvailabilityException>(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: 'TrainerProfile', required: true },
    date: { type: Date, required: true},
    reason: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

AvailabilityExceptionSchema.index({ trainerId: 1, date: 1 }, { unique: true });

export const AvailabilityException = mongoose.model<IAvailabilityException>('AvailabilityException', AvailabilityExceptionSchema);
