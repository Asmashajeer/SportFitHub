import { PAYLOAD_MODEL } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { getTimezone } from '@/context/timezone.context';
import { CreateCheckoutSessionDTO } from '@/dtos/request/booking/booking.request.dto';

import { GetInvoiceResponseDTO, UserPaymentResponseDTO } from '@/dtos/response/booking/payment.response.dto';

import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { IPaymentRepository } from '@/interfaces/repositories/IPayment.repository';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IPaymentService } from '@/interfaces/services/booking/IPayment.service';
import { toUserPaymentResponseDTO } from '@/mappers/booking/payment.mappers';


import AppError from '@/utils/AppError';
import { Types } from 'mongoose';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class PaymentService implements IPaymentService {
  private _paymentRepo: IPaymentRepository;
  private _userRepo: IUserRepository;
  private _sportsSessionRepo: ISportsSessionRepository;
  private _fitnessSessionRepo: IFitnessSessionRepository;
  constructor(paymentRepo: IPaymentRepository, userRepo: IUserRepository, sportsSessionRepo: ISportsSessionRepository, fitnessSessionRepo: IFitnessSessionRepository) {
    this._paymentRepo = paymentRepo;
    this._userRepo = userRepo;
    this._sportsSessionRepo = sportsSessionRepo;
    this._fitnessSessionRepo = fitnessSessionRepo;
  }

  createCheckoutSession = async ({ userId, lockKeys, ...payload }: CreateCheckoutSessionDTO): Promise<Stripe.Checkout.Session> => {
    const timezone = getTimezone();
    const userInfo = await this._userRepo.findById(userId);
    if (!userInfo) throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const sessionRepo = payload.sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;
    const session = await sessionRepo.findById(payload.sessionId);
    if (!session) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const amount = session.pricing[0].price * 100;

    const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: session.sessionName, // The title the user sees on Stripe's page
              // description: `Booking for ${payload.date} at ${payload.slotTime}`,
            },
            unit_amount: amount,
          },
          quantity: payload.numberOfSessions,
        },
      ],
      mode: 'payment',
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        SessionId: payload.sessionId.toString(),
        trainerId: payload.trainerId.toString(),
        sessionsToBook: JSON.stringify(payload.sessionsToBook),
        planId: payload.planId.toString(),
        numberOfSessions: payload.numberOfSessions.toString(),
        amount: payload.amount.toString(),
        sessionModel: payload.sessionModel,
        lockKeys: JSON.stringify(lockKeys),
        userId: userInfo?._id.toString(),
        email: userInfo.email.toString(),
        userName: userInfo.name.toString(),
        userTimezone: timezone,
      },
      customer_email: userInfo.email,
      success_url: `${process.env.FRONTEND_URL}/checkout/booking-success?stripeSession_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    };
    const stripeSession = await stripe.checkout.sessions.create(sessionCreateParams);
    return stripeSession;
  };

  //-----------find user payments------
  async getUserPayments(userId: string | Types.ObjectId): Promise<UserPaymentResponseDTO[]> {
    const payments = await this._paymentRepo.findByUserId({ userId: userId });
    if (!payments) throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const userPayments = payments.map((payment) => toUserPaymentResponseDTO(payment));
    return userPayments;
  }

  //   -----------find booking invoice------
  async getInvoice(invoiceId: string): Promise<GetInvoiceResponseDTO> {
    if (invoiceId) {
      const invoice = await stripe.invoices.retrieve(invoiceId);
      return {
        pdfUrl: invoice.invoice_pdf, // send this to frontend for download
        invoiceUrl: invoice.hosted_invoice_url, // send this to frontend to view
      };
    }
  }

  


}
