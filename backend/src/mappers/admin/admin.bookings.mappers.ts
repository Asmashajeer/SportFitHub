
import { SESSION_TYPE } from "@/constants/enums";
import { IBooking } from "@/models/booking.model"
import bookingSessionModel, { IBookingSession } from "@/models/booking.session.model";
import { Types } from "mongoose";
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from "@/context/timezone.context";




interface BookingUser{
    _id:Types.ObjectId;
    name:string,
    email:string
}

 
interface AdminIBooking extends Omit<IBooking,'userId' |'sessionId'>{
  userId:BookingUser,
  bookingUId:string,
   sessionId:{
      _id:Types.ObjectId
      trainerId:Types.ObjectId,
      sessionName:string,
      sessionType:typeof SESSION_TYPE[keyof typeof SESSION_TYPE]   //ONE -TO-ONE, GROUP
   }
}

export const toAdminBookingsResponseDTO=(booking:AdminIBooking)=>{
     const timezone = getTimezone();
    return {
          bookingId: booking._id.toString(),
          bookingUId:booking.bookingUId,
          userId:booking.userId._id.toString(),
          userName: booking.userId.name,
          userEmail: booking.userId.email,         
          sessionId: booking.sessionId._id.toString(),
          trainerId: booking.sessionId.trainerId.toString(),
          sessionName: booking.sessionId.sessionName,
          sessionType: booking.sessionId.sessionType,
          sessionModel:booking.sessionModel,                
          pricePlan: booking.pricePlan,
          status: booking.status,   
          venue: booking.venue,
          createdAt: formatInTimeZone(booking.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
    }
}

export const toAdminBookingSessionDTO=(bookingSession:IBookingSession)=>{
     const timezone = getTimezone();
    return {
          bookingSessionId:bookingSession._id.toString(),
          date: formatInTimeZone(bookingSession.date,timezone, 'yyyy-MM-dd HH:mm:ssXXX').toString(),
          startTime:bookingSession.startTime,
          endTime:bookingSession.endTime,
          status: bookingSession.status,
          attendance:bookingSession.attendance,
          refundedToWallet:bookingSession.refundedToWallet,
          refundAmount:bookingSession.refundAmount,
          cancellationReason:bookingSession.cancellationReason
    }
}

export const toAdminBookingSessionDTOwithUserId=(bookingSession:IBookingSession)=>{
    return{
        ...toAdminBookingSessionDTO(bookingSession),           
        userId:bookingSession.userId.toString(),
    }
}