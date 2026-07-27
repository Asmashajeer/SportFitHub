import { STATUS_CODE } from '@/constants/messages';

import { IBookingService } from '@/interfaces/services/booking/IBooking.service';
import { ISlotLockService } from '@/interfaces/services/booking/ISlotLock.service';

import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export class WebhookController {
  private _bookingService: IBookingService;
  private _slotLockService: ISlotLockService;
  constructor(bookingService: IBookingService, slotLockService: ISlotLockService) {
    this._bookingService = bookingService;
    this._slotLockService = slotLockService;
  }
  public handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(STATUS_CODE.ERROR.BAD_REQUEST).send('Missing stripe-signature ');
    }
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(` Webhook Error: ${err.message}`);
      return next(err);
    }
    const stripeSession = event.data.object as Stripe.Checkout.Session;
    const lockKeys = stripeSession.metadata.lockKeys;

    // Handle  payment
    switch (event.type) {
      case 'checkout.session.completed': {
        const paymentIntentId = stripeSession.payment_intent as string;
        const invoiceId = stripeSession.invoice as string;
        console.log("payment completed");
        if (!paymentIntentId) {
          console.error(' No PaymentIntent ID found in session');
          return res.status(STATUS_CODE.ERROR.BAD_REQUEST).json({ message: 'No PaymentIntent found' });
        }
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId as string,
            { expand: ['latest_charge'] } // This allows you to get the receipt_url
          );
          if(!paymentIntent){
            console.log("no payment intent"); return
          }
          await this._bookingService.confirmBooking(stripeSession, paymentIntent, invoiceId);
          console.log('booking completed');
          this.releaseLocks(lockKeys);
          res.status(STATUS_CODE.SUCCESS.OK).json({ received: true });
        } catch (err) {
          console.log(' booking or payment record not  completed or error while retreving payment reciept');
          // this.releaseLocks(lockKeys);
          return next(err);
        }
        break;
      }
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        this.releaseLocks(lockKeys);
        console.log("payment failed");
        res.status(STATUS_CODE.SUCCESS.OK).json({ received: true });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        res.status(STATUS_CODE.SUCCESS.OK).json({ received: true });
    }
  };

  private async releaseLocks(lockKeys: string | undefined) {
    if (!lockKeys) return;
    const locks = lockKeys.split(',');
    for (const lock of locks) {
      await this._slotLockService.releaseLock(lock);
    }
  }
}
