import { BOOKING_TYPE } from '@/constants/enums';
import { STATUS_CODE } from '@/constants/messages';

import { IBookingService } from '@/interfaces/services/booking/IBooking.service';
import { ISlotLockService } from '@/interfaces/services/booking/ISlotLock.service';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';

import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export class WebhookController {
  private _bookingService: IBookingService;
  private _slotLockService: ISlotLockService;
  private _stripe: Stripe 
  constructor(bookingService: IBookingService, slotLockService: ISlotLockService,stripe:Stripe,) {
    this._bookingService = bookingService;
    this._slotLockService = slotLockService;
    this._stripe=stripe
  }
  public handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(STATUS_CODE.ERROR.BAD_REQUEST).send('Missing stripe-signature ');
    }
    let event: Stripe.Event;

    try {
      event = this._stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(` Webhook Error: ${err.message}`);
      return next(err);
    }


    // Handle  payment
    switch (event.type) {
      case 'checkout.session.completed': {
        const stripeSession = event.data.object as Stripe.Checkout.Session;
        const lockKeys = stripeSession.metadata.lockKeys;
        const paymentIntentId = stripeSession.payment_intent as string;
        const invoiceId = stripeSession.invoice as string;
        console.log("payment completed");
        if (!paymentIntentId) {
          console.error(' No PaymentIntent ID found in session');
          return res.status(STATUS_CODE.ERROR.BAD_REQUEST).json({ message: 'No PaymentIntent found' });
        }
        try {
          const paymentIntent = await  this._stripe.paymentIntents.retrieve(
            paymentIntentId as string,
            { expand: ['latest_charge'] } // This allows you to get the receipt_url
          );
          if(!paymentIntent){
            console.log("no payment intent"); return
          }
          await this._bookingService.confirmBooking(stripeSession, paymentIntent, invoiceId);
          console.log('booking completed');
          await this.releaseLocks(lockKeys);
          res.status(STATUS_CODE.SUCCESS.OK).json({ received: true });
        } catch (err) {
          console.log(' booking or payment record not  completed or error while retreving payment reciept');
          // this.releaseLocks(lockKeys);
          return next(err);
        }
        break;
      }
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':{
        await this.handlePaymentFailure(event);       
        res.status(STATUS_CODE.SUCCESS.OK).json({ received: true });
        break;

      }
      default:
        console.log(`Unhandled event type ${event.type}`);
        res.status(STATUS_CODE.SUCCESS.OK).json({ received: true });
    }
  };


  private handlePaymentFailure = async (event: Stripe.Event) => {
      const stripeSession = event.data.object as Stripe.Checkout.Session; 
      
      const { lockKeys, email,userName } = stripeSession.metadata || {}; 
      const bookingType = stripeSession.metadata.bookingType as BOOKING_TYPE;
      
      const numberOfSessions = Number(stripeSession.metadata.numberOfSessions);
      const amount = Number(stripeSession.metadata.amount);
      try {
        //  Release locks
        await this.releaseLocks(lockKeys);
        await sendNotificationEmail({
                to:email,
                title: 'Payment failed!',
                description: event.type === 'checkout.session.expired' 
              ? 'Checkout session has expired. Please create a new booking.'
              : 'Payment processing failed. Please retry.',
                details: {
                  userName: userName,              
                  numberOfSessions: numberOfSessions,
                  amount: amount,
                  type:bookingType
                },
                closingLine: "We're here to help if you run into issues. Contact support@example.com or reply to this email.",
              });    
      } catch (error) {
        console.error(`Error handling payment failure `, error);     
        try {
          await this.releaseLocks(lockKeys);
        } catch (lockError) {
          console.error(`Failed to release locks `, lockError);
        }        
        throw error; // Re-throw so webhook handler catches it
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
