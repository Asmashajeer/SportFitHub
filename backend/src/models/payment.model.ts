import { DISCOUNT_TYPE, PAYMENT_STATUS } from '@/constants/enums';
import mongoose, { Schema } from 'mongoose';
import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  bookingUId: string;
  bookingId?: Types.ObjectId; // Cross-reference back to Booking
  userId: Types.ObjectId;
  transactionId: string; // The Stripe PaymentIntent ID (pi_...)
  invoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  receiptUrl?: string; // URL provided by Stripe for the receipt
  discount?: {
    code: string;
    amountOff: number; // How much was deducted
    type: DISCOUNT_TYPE;
  };
  status: PAYMENT_STATUS;
  createdAt: Date;
}

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: false },
  bookingUId: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transactionId: { type: String, required: false }, // Stripe PaymentIntent ID
  invoiceId: { type: String, required: false, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'inr' },
  paymentMethod: { type: String },
  discount: {
    code: String,
    amountOff: Number,
    type: Object.values(DISCOUNT_TYPE),
  },
  status: { type: String, enum: Object.values(PAYMENT_STATUS) },
  receiptUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
