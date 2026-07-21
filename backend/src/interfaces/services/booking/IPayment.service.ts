import { CreateCheckoutSessionDTO } from '@/dtos/request/booking/booking.request.dto';
import { UserPaymentResponseDTO } from '@/dtos/response/booking/booking.response.dto';
import { GetInvoiceResponseDTO } from '@/dtos/response/booking/payment.response.dto';
import { Types } from 'mongoose';
import Stripe from 'stripe';

export interface IPaymentService {
  createCheckoutSession({ userId, lockKeys, ...payload }: CreateCheckoutSessionDTO): Promise<Stripe.Checkout.Session>;
  getUserPayments(userId: string | Types.ObjectId): Promise<UserPaymentResponseDTO[]>;
  getInvoice(invoiceId: string): Promise<GetInvoiceResponseDTO>;
}
