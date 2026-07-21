import { TRANSACTION_REASON, TRANSACTION_STATUS, TRANSACTION_TYPE } from '@/constants/enums';
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWalletTransaction extends Document {
  userId: Types.ObjectId;
  transactionType: TRANSACTION_TYPE;
  amount: number;
  walletTransactionReason: TRANSACTION_REASON;
  status: TRANSACTION_STATUS;
  description: string;
  balanceAfter: number;
  // OPTIONAL
  // when transaction is booking-related
  bookingId?: Types.ObjectId;
  bookingSessionId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    walletTransactionReason: {
      type: String,
      enum: Object.values(TRANSACTION_REASON),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    // Optional — only when booking-related
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    bookingSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'BookingSession',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWalletTransaction>('WalletTRansaction', WalletTransactionSchema);
