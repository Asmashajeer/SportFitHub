import { DISCOUNT_TYPE, PAYMENT_STATUS } from '@/constants/enums';

export interface UserPaymentResponseDTO {
  id: string;
  bookingId: string; // Cross-reference back to Booking
  bookingUID: string;
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

export interface GetInvoiceResponseDTO {
  pdfUrl: string;
  invoiceUrl: string;
}
