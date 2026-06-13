import type { DISCOUNT_TYPE, PAYMENT_STATUS } from '@/constants/constants';

export interface UserPaymentResponseData {
  id: string;
  bookingId: string; // Cross-reference back to Booking
  bookingUId:string,
  userId: string;
  transactionId: string; // The Stripe PaymentIntent ID (pi_...)
  invoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  receiptUrl?: string; // URL provided by Stripe for the receipt
  discount?: {
    code: string;
    amountOff: number; // How much was deducted
    type: (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];
  };
  status: (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
  createdAt: string;
}
