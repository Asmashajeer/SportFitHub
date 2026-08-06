import { PaymentAdminResponseDTO } from "@/dtos/response/admin/payment.response.dto";
import { IPayment } from "@/models/payment.model";

export function toPaymentAdminResponseDTO(payment: IPayment): PaymentAdminResponseDTO {
  return {
    id: payment._id.toString(),
    bookingUID: payment.bookingUID,
    bookingId: payment.bookingId?.toString(),
    userId: payment.userId.toString(),
    transactionId: payment.transactionId,
    invoiceId: payment.invoiceId,
    amount: payment.amount,
    currency: payment.currency,
    paymentMethod: payment.paymentMethod,
    receiptUrl: payment.receiptUrl,
    discount: payment.discount,
    status: payment.status,
    createdAt: payment.createdAt.toISOString(),
  };
}