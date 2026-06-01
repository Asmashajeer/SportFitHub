import { PAGINATION_LIMIT, PAYLOAD_MODEL } from "@/constants/enums";
import { STATUS_CODE } from "@/constants/messages";
import { getTimezone } from "@/context/timezone.context";
import { CheckAvailabilityDTO } from "@/dtos/request/booking/booking.request.dto";
import { IBookingService } from "@/interfaces/services/booking/IBooking.service";
import { AuthRequest } from "@/middleware/auth.middleware";
import AppError from "@/utils/AppError";

import { Request,Response,NextFunction } from "express";

export class BookingController{
    private _bookingService:IBookingService;
    constructor(bookingService:IBookingService){
        this._bookingService=bookingService;
    }

 
      // -----------check availability on a specific date and slot
     checkAvailability=async (req: Request, res: Response,next:NextFunction) => {
        try{
            const timezone=getTimezone();
            const bookingSlot=req.query as unknown as CheckAvailabilityDTO;
            bookingSlot.timezone=timezone;
            const { isAvailable,remainingCount}= await this._bookingService.checkAvailability(bookingSlot);
            console.log( "isAvailable :", isAvailable,"remainingCount   :",remainingCount,timezone)
            res.status(STATUS_CODE.SUCCESS.OK).json({isAvailable, remainingCount});
        }
        catch(err){
            next(err);
        }
     }


     //-------------------get booking status by stripeSessionId------
    getBookingStatus = async (req: Request, res: Response,next:NextFunction) => {
        const { stripeSessionId } = req.params;
        try{
        // Find the booking by stripe sessionId
       
            const booking = await this._bookingService.findBySessionId(stripeSessionId ); 

            res.status(STATUS_CODE.SUCCESS.OK).json({
                status: booking.status, 
                details: booking,
                receipt: booking.paymentId.receiptUrl // Saved from your webhook!
            });
        }catch(err){
            next(err);
        }
    }

     //-------------------get user bookings---
    getUserBookings = async (req: Request, res: Response,next:NextFunction) => {
        const authReq = req as AuthRequest;
        const user = authReq.user;
        try{       
            const bookings = await this._bookingService.getUserBookings(user.id ); 
            res.status(STATUS_CODE.SUCCESS.OK).json(bookings);
        }catch(err){
            next(err);
        }
    }

     //-------------------get user booked Sessions---
    getUserSessions = async (req: Request, res: Response,next:NextFunction) => {
        const authReq = req as AuthRequest;
        const user = authReq.user;
        try{       
            const sessions = await this._bookingService.getUserSessions(user.id ); 
            res.status(STATUS_CODE.SUCCESS.OK).json(sessions);
        }catch(err){
            next(err);
        }
    }


       //----------------reschedule BookedSession----------------------
     rescheduleBookedSession= async (req: Request, res: Response,next:NextFunction) => {
           
        const { sessionBookingId } = req.params;
        const {newSlot}=req.body ;
        try{        
            const newBooking = await this._bookingService.rescheduleSession(sessionBookingId,newSlot); 
            res.status(STATUS_CODE.SUCCESS.OK).json(newBooking);                 
            
        }catch(err){
            next(err);
        }
    }

       //----------------Cancel BookedSession----------------------
     cancelBookedSession= async (req: Request, res: Response,next:NextFunction) => {
        const authReq = req as AuthRequest;
        if (!authReq.user) {           
            return next(new AppError('Authentication required. Please log in.', STATUS_CODE.ERROR.UNAUTHORIZED));
        }
        const userId = authReq.user.id; 
        const { sessionBookingId } = req.params;
        const  {reason}=req.body;
        
        try{        
            const data= await this._bookingService.cancelSession(sessionBookingId,userId,reason); 
            res.status(STATUS_CODE.SUCCESS.OK).json(data);                 
            
        }catch(err){
            next(err);
        }
    }
  


    getPublicBookedSlots=async (req: Request, res: Response,next:NextFunction) =>{
        const {sessionId}=req.params;
       try{
        const bookings = await this._bookingService.getPublicBookedSlots(sessionId );       
             res.status(STATUS_CODE.SUCCESS.OK).json(bookings);
        }catch(err){
            next(err);
        }
    }

       //-------------------get booked Sessions by trainer-ID-----
    getBookedSessionsByTrainer = async (req:Request, res: Response,next:NextFunction) => {             
        const {trainerId}=req.params;
        const timezone=getTimezone();        
        const page = parseInt(req.query.page as string) || 1;
        const sessionModel = req.query.sessionModel as PAYLOAD_MODEL
        const date = req.query.date as string;
        const status=req.query.status  as string
           

        const limit = parseInt(req.query.limit as string) || PAGINATION_LIMIT;
        try{       
            const sessionsData = await this._bookingService.getBookedSessionByTrainerId(trainerId,timezone,{page,sessionModel,date,status,limit}); 
            res.status(STATUS_CODE.SUCCESS.OK).json(sessionsData);
        }catch(err){
            next(err);
        }
    }

    //-----------------check duplicate booking----------------
    checkDuplicateBooking=async (req:AuthRequest, res: Response,next:NextFunction) => {
        const {bookingSlots,sessionId}=req.body;
        const userId=req.user.id;
        const isDuplicate= await this._bookingService.checkDuplicateBooking(userId,sessionId,bookingSlots); 

        res.status(STATUS_CODE.SUCCESS.OK).json(isDuplicate);
    }

}