import {  BookingSession_Price, IBookedSessionPopulateUserAndSession } from '@/dtos/request/booking/booking.request.dto';
import { IBooking } from '@/models/booking.model';
import { IBookedSessionPopulate, IBookingSession } from '@/models/booking.session.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from '@/context/timezone.context';
import { UserSessionsResponseDTOwithPopulatedSession, UserSessionsResponseDTOwithPrice } from '@/dtos/response/booking/booking.response.dto';
import { Types } from 'mongoose';

interface Counts {
  _id: Types.ObjectId;
  scheduledCount: number;
  cancelledCount: number;
  completedCount: number;
}

export const toUserBookingResponseDTO = (booking: IBooking) => {
  const timezone = getTimezone();
  return {
    id: booking._id.toString(),
    bookingUID: booking.bookingUID,
    userId: booking.userId.toString(),
    sessionId: booking.sessionId.toString(),
    sessionModel: booking.sessionModel,
    bookingType: booking.bookingType,
    stripeSessionId: booking.stripeSessionId,
    pricePlan: booking.pricePlan,
    venue: booking.venue ?? null,
    status: booking.status,
    paymentId: booking.paymentId.toString(),

    updatedAt: formatInTimeZone(booking.updatedAt, timezone, 'yyyy-MM-dd'),
    createdAt: formatInTimeZone(booking.createdAt, timezone, 'yyyy-MM-dd '),
  };
};
export const totoUserBookingResponseDTOwithStatusCount = (booking: IBooking, counts: Counts[]) => {

  const count = counts.find((c) => c._id.toString() === booking._id.toString());

  return {
    ...toUserBookingResponseDTO(booking),
    scheduledCount: count?.scheduledCount ?? 0,
    cancelledCount: count?.cancelledCount ?? 0,
    completedCount: count?.completedCount ?? 0,
  };
};

export const toBookedSlotPublicResponseData = (booking: IBookingSession) => {
  return {
    sessionId: booking.sessionId.toString(),
    slotId: booking.slotId,
    date: formatInTimeZone(booking.date, booking.timezone, 'yyyy-MM-dd'),
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
  };
};
export const toUserSessionsResponseDTO = (bookedSession: IBookingSession) => {
  return {
    id: bookedSession._id.toString(),
    bookingId: bookedSession.bookingId.toString(),
    bookingUID: bookedSession.bookingUID,
    userId: bookedSession.userId.toString(),
    trainerId: bookedSession.trainerId.toString(),
    sessionId: bookedSession.sessionId.toString(),
    sessionModel: bookedSession.sessionModel,
    slotId: bookedSession.slotId,
    date: formatInTimeZone(bookedSession.date, bookedSession.timezone, 'yyyy-MM-dd'),
    startTime: bookedSession.startTime,
    endTime: bookedSession.endTime,
    startDateTime: formatInTimeZone(bookedSession.startDateTime, bookedSession.timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    endDateTime: formatInTimeZone(bookedSession.endDateTime, bookedSession.timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    timezone: bookedSession.timezone,
    status: bookedSession.status,
    rescheduledTo: bookedSession.rescheduledTo?.toString(),
    attendance: bookedSession.attendance,
    cancellationReason: bookedSession.cancellationReason,
    refundedToWallet: bookedSession.refundedToWallet,
    refundAmount: bookedSession.refundAmount,
  };
};
export const toUserSessionsResponseDTOwithPopulatedSession = (bookedSession: IBookedSessionPopulate): UserSessionsResponseDTOwithPopulatedSession => {
  return {
    id: bookedSession._id.toString(),
    bookingId: bookedSession.bookingId._id.toString(),
    bookingUID: bookedSession.bookingUID,
    userId: bookedSession.userId.toString(),
    trainer: {
      id:bookedSession.trainerId._id.toString(),
      userId:bookedSession.trainerId.userId.toString(),
      trainerName:bookedSession.trainerId.displayName,
    },
    sessionModel: bookedSession.sessionModel,
    slotId: bookedSession.slotId,
    date: formatInTimeZone(bookedSession.date, bookedSession.timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    startTime: bookedSession.startTime,
    endTime: bookedSession.endTime,
    startDateTime: bookedSession.startDateTime.toISOString(),  //in UTC
    endDateTime: bookedSession.endDateTime.toISOString(),  // in UTC
    timezone: bookedSession.timezone,
    status: bookedSession.status,
    rescheduledTo: bookedSession.rescheduledTo?.toString(),
    attendance: bookedSession.attendance,
    cancellationReason: bookedSession.cancellationReason,
    refundedToWallet: bookedSession.refundedToWallet,
    refundAmount: bookedSession.refundAmount,
    session: {
      sessionId: bookedSession.sessionId._id.toString(),
      trainerId: bookedSession.sessionId.trainerId.toString(),
      sessionName: bookedSession.sessionId.sessionName,
      sessionType: bookedSession.sessionId.sessionType,
      maxCapacity: bookedSession.sessionId.maxCapacity,
      bookingDeadline: bookedSession.sessionId.bookingDeadline,
      cancellationWindow: bookedSession.sessionId.cancellationWindow,
    },
    venue: bookedSession.bookingId.venue ?? null,
  };
};
export const toUserSessionsResponseDTOwithPrice = (bookedSession):UserSessionsResponseDTOwithPrice => {
   return {
    ...toUserSessionsResponseDTOwithPopulatedSession(bookedSession),
    unitPrice:bookedSession.bookingId.pricePlan.unitPrice,      
    
  };

} 
export const toCancelBookedSessionResponseDTO = (data) => {
  const timezone = getTimezone();
  return {
    sessionBookingId: data.sessionBookingId.toString(),
    bookingId: data.bookingId.toString(),
    bookingUID: data.bookingUID,
    refundAmount: data.refundAmount,
    walletBalance: data.walletBalance,
    cancelledAt: formatInTimeZone(data.cancelledAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};

export const toBookedSessionResponseDTOWithPopulatedUser = (bookedSession: IBookedSessionPopulateUserAndSession) => {

  return {
    id: bookedSession._id.toString(),
    bookingId: bookedSession.bookingId._id.toString(),
    bookingUID: bookedSession.bookingUID,
    userId: bookedSession.userId._id.toString(),
    userName: bookedSession.userId.name,
    userEmail: bookedSession.userId.email,
    sessionId: bookedSession.sessionId._id.toString(),
    sessionModel: bookedSession.sessionModel,
    trainerId: bookedSession.sessionId.trainerId.toString(),
    sessionName: bookedSession.sessionId.sessionName,
    sessionType: bookedSession.sessionId.sessionType,
    maxCapacity: bookedSession.sessionId.maxCapacity,
    bookingDeadline: bookedSession.sessionId.bookingDeadline,
    cancellationWindow: bookedSession.sessionId.cancellationWindow,
    venue: (bookedSession.bookingId as unknown as IBooking).venue ?? null,
    slotId: bookedSession.slotId,
    date: formatInTimeZone(bookedSession.date, bookedSession.timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    startTime: bookedSession.startTime,
    endTime: bookedSession.endTime,
    startDateTime: bookedSession.startDateTime.toISOString(),// in UTC
    endDateTime: bookedSession.endDateTime.toISOString(),  //in UTC
    timezone: bookedSession.timezone,
    status: bookedSession.status,
    rescheduledTo: bookedSession.rescheduledTo,
    attendance: bookedSession.attendance,
    cancellationReason: bookedSession.cancellationReason,
    refundedToWallet: bookedSession.refundedToWallet,
    refundAmount: bookedSession.refundAmount,
  };
};



export const toBookingSession_Price=(bookingSession):BookingSession_Price=>{
    return{
      ...toUserSessionsResponseDTO(bookingSession),
      unitPrice:bookingSession.bookingId.pricePlan.unitPrice,
    }
}