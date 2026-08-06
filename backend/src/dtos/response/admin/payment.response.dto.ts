import { DISCOUNT_TYPE, PAYMENT_STATUS } from "@/constants/enums";
import { PaginationResponseDTO } from "../pagination.response.dto";

export interface PaymentAdminResponseDTO {
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
    type: DISCOUNT_TYPE;
  };
  status: PAYMENT_STATUS;
  createdAt: string;
}

export interface AdminPaymentsResponseDTOwithPagination extends PaginationResponseDTO {
  payments: PaymentAdminResponseDTO[];
}