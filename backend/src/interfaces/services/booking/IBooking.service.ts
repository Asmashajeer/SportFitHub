import { UserRole } from "@/constants/enums";
import { BookedSlot, BookingSessionRequestfilterDTO, CheckAvailabilityDTO, PayloadDTO } from "@/dtos/request/booking/booking.request.dto";
import {  BookedSessionTrainerResponseDTO, BookedSlotPublicResponseData, BookingConfirmResponseDTO, CancelBookedSessionResponseDTO, UserBookedSessionsResponseDTO, UserBookingResponseDTO, UserSessionsResponseDTOwithPopulatedSession } from "@/dtos/response/booking/booking.response.dto";
import { IAuthUser } from "@/interfaces/common/IAuthUser";
import { IBookedSlot } from "@/models/booking.model";
import { ClientSession, Types } from "mongoose";
import Stripe from "stripe";

export interface IBookingService{
    lockSessionSlots(lockSlotsData):Promise<string[]>
  confirmBooking(stripeSession: Stripe.Checkout.Session,paymentIntent: Stripe.PaymentIntent,invoiceId:string ):Promise< BookingConfirmResponseDTO>
   findBySessionId(stripeSessionId:string|Types.ObjectId)
    checkAvailability(bookingData:CheckAvailabilityDTO,session?:ClientSession) 
    checkDuplicateBooking(userId:string,sessionId:string,bookingSlots:IBookedSlot[]):Promise<string|null>
    getUserBookings(userId :string|Types.ObjectId):Promise<UserBookingResponseDTO[]>
   getUserSessions(userId :string|Types.ObjectId):Promise<UserSessionsResponseDTOwithPopulatedSession[]> 
  rescheduleSession(sessionBookingId: string,newSlot:BookedSlot):Promise<UserBookedSessionsResponseDTO>
  cancelSession(sessionBookingId: string,reason:string,cancelledBy:UserRole):Promise<CancelBookedSessionResponseDTO>
    getPublicBookedSlots(sessionId :string):Promise<BookedSlotPublicResponseData[]>
    getBookedSessionByTrainerId(trainerId:string,timezone:string,filter:BookingSessionRequestfilterDTO):Promise<BookedSessionTrainerResponseDTO>
    createBookingWithWallet(userId:string,payload:PayloadDTO ):Promise<BookingConfirmResponseDTO>
    getBookedSessionsBySessionId(sessionId:string):Promise<UserSessionsResponseDTOwithPopulatedSession[]>
    isWithinCancellationWindow(date: string, time: string,cancellationWindow:number): boolean
     autoCompleteSessions() 
}