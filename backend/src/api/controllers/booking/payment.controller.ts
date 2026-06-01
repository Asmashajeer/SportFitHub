

import type { Request, Response, NextFunction } from 'express';
import { STATUS_CODE, SUCCESS_MESSAGES } from "@/constants/messages";

import { IPaymentService } from "@/interfaces/services/booking/IPayment.service";
import { IBookingService } from '@/interfaces/services/booking/IBooking.service';
import { AuthRequest } from '@/middleware/auth.middleware';
import AppError from '@/utils/AppError';


export class PaymentController{
    private _paymentService:IPaymentService;
    private  _bookingService:IBookingService;
    constructor(paymentService:IPaymentService,bookingService:IBookingService){
        this._paymentService=paymentService;
        this._bookingService=bookingService
    }


    createCheckoutSession=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {           
            return next(new AppError('Authentication required. Please log in.', STATUS_CODE.ERROR.UNAUTHORIZED));
        }
            const userId = authReq.user.id;           
            const payload=authReq.body;
            
            //  lock slots
        try {
            const lockSlotsData=payload.sessionsToBook.map((slot)=>({
                userId:payload.user?.userId,
                sessionId:payload.sessionId,
                date:slot.date,
                slotId:slot.slotId,
                startTime:slot.startTime
            })) 
            const lockKeys=await this._bookingService.lockSessionSlots(lockSlotsData);
       
            
            const stripeSession=await this._paymentService.createCheckoutSession({ userId,lockKeys,...payload });        
            
            res.status(STATUS_CODE.SUCCESS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING.CHECKOUT_SESSION_CREATED,
                url: stripeSession.url
            });        
            
        } catch (err) {
            next(err);
        }
    };

    //--------------get user payments----------
    getUserPayments = async (req: Request, res: Response,next:NextFunction) => {
        const authReq = req as AuthRequest;
        const user = authReq.user;
        try{
       
            const payments = await this._paymentService.getUserPayments(user.id ); 
            

            res.status(STATUS_CODE.SUCCESS.OK).json(payments);
        }catch(err){
            next(err);
        }
    }
    getInvoice=async(req: Request, res: Response,next:NextFunction) => {
        const authReq = req as AuthRequest;
       
         const {invoiceId}=authReq.params;
        try{
         const invoice = await this._paymentService.getInvoice(invoiceId );         
         res.status(STATUS_CODE.SUCCESS.OK).json(invoice);
        }catch(err){
            next(err);
        }
    }
}

