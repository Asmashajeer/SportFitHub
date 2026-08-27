import type { DISCOUNT_TYPE, PAYMENT_STATUS } from "@/constants/constants";

export interface AdminPaymentResponseData{
  id: string;
  bookingUID: string;
  bookingId?: string;
  userId: string;
  transactionId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  receiptUrl?: string;
  discount?: {
    code: string;
    amountOff: number;
    type:(typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];
  };
  status:(typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
  createdAt: string;
}



export interface AdminPaymentOverviewResponseData{
   range: {
    startDate:Date,
    endDate:Date
   }| null,
  grossRevenue:number,
  totalRefunds:number,
  netRevenue:number,
  totalPayouts:number,
  commissionEarned:number,
  pendingPayoutLiability:number,
}