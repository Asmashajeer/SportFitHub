import { IBookedSessionPopulateUser, IBookedSessionPopulateUserAndSession } from '@/dtos/request/booking/booking.request.dto';
import { IBooking, IVenue } from '@/models/booking.model';
import { IBookedSessionPopulate, IBookingSession } from '@/models/booking.session.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from '@/context/timezone.context';
import { UserSessionsResponseDTOwithPopulatedSession } from '@/dtos/response/booking/booking.response.dto';
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
    bookingUId: booking.bookingUId,
    userId: booking.userId.toString(),
    sessionId: booking.sessionId.toString(),
    sessionModel: booking.sessionModel,
    bookingType: booking.bookingType,
    stripeSessionId: booking.stripeSessionId,
    pricePlan: booking.pricePlan,
    venue: booking.venue,
    status: booking.status,
    paymentId: booking.paymentId.toString(),

    updatedAt: formatInTimeZone(booking.updatedAt, timezone, 'yyyy-MM-dd'),
    createdAt: formatInTimeZone(booking.createdAt, timezone, 'yyyy-MM-dd '),
  };
};
export const totoUserBookingResponseDTOwithStatusCount = (booking: IBooking, counts: Counts[]) => {
  const timezone = getTimezone();
  const count = counts.find((c) => c._id.toString() === booking._id.toString());

  return {
    ...toUserBookingResponseDTO(booking),
    scheduledCount: count?.scheduledCount ?? 0,
    cancelledCount: count?.cancelledCount ?? 0,
    completedCount: count?.completedCount ?? 0,
  };
};

export const toBookedSlotPublicResponseData = (booking: IBookingSession) => {
  const timezone = getTimezone();
  return {
    sessionId: booking.sessionId.toString(),
    slotId: booking.slotId,
    date: formatInTimeZone(booking.date, timezone, 'yyyy-MM-dd'),
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
  };
};
export const toUserSessionsResponseDTO = (bookedSession: IBookingSession) => {
  const timezone = getTimezone();
  return {
    id: bookedSession._id.toString(),
    bookingId: bookedSession.bookingId.toString(),
    userId: bookedSession.userId.toString(),
    trainerId: bookedSession.trainerId.toString(),
    sessionId: bookedSession.sessionId.toString(),
    sessionModel: bookedSession.sessionModel,
    slotId: bookedSession.slotId,
    date: formatInTimeZone(bookedSession.date, timezone, 'yyyy-MM-dd'),
    startTime: bookedSession.startTime,
    endTime: bookedSession.endTime,
    status: bookedSession.status,
    rescheduledTo: bookedSession.rescheduledTo?.toString(),
    attendance: bookedSession.attendance,
    cancellationReason: bookedSession.cancellationReason,
    refundedToWallet: bookedSession.refundedToWallet,
    refundAmount: bookedSession.refundAmount,
  };
};
export const toUserSessionsResponseDTOwithPopulatedSession = (bookedSession: IBookedSessionPopulate): UserSessionsResponseDTOwithPopulatedSession => {
  const timezone = getTimezone();

  return {
    id: bookedSession._id.toString(),
    bookingId: bookedSession.bookingId._id.toString(),
    userId: bookedSession.userId.toString(),
    trainerId: bookedSession.trainerId.toString(),
    sessionModel: bookedSession.sessionModel,
    slotId: bookedSession.slotId,
    date: formatInTimeZone(bookedSession.date, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    startTime: bookedSession.startTime,
    endTime: bookedSession.endTime,
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
    venue: bookedSession.bookingId.venue,
  };
};

export const toCancelBookedSessionResponseDTO = (data) => {
  const timezone = getTimezone();
  return {
    sessionBookingId: data.sessionBookingId.toString(),
    bookingId: data.bookingId.toString(),
    refundAmount: data.refundAmount,
    walletBalance: data.walletBalance,
    cancelledAt: formatInTimeZone(data.cancelledAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};

export const toBookedSessionResponseDTOWithPopulatedUser = (bookedSession: IBookedSessionPopulateUserAndSession) => {
  const timezone = getTimezone();
  return {
    id: bookedSession._id.toString(),
    bookingId: bookedSession.bookingId._id.toString(),
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
    venue: (bookedSession.bookingId as unknown as IBooking).venue as IVenue,
    slotId: bookedSession.slotId,
    date: formatInTimeZone(bookedSession.date, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    startTime: bookedSession.startTime,
    endTime: bookedSession.endTime,
    status: bookedSession.status,
    rescheduledTo: bookedSession.rescheduledTo,
    attendance: bookedSession.attendance,
    cancellationReason: bookedSession.cancellationReason,
    refundedToWallet: bookedSession.refundedToWallet,
    refundAmount: bookedSession.refundAmount,
  };
};

export const toSessionOccuranceResponseDTO = (bookedSessionGroup: IBookedSessionPopulateUser[]) => {
  return {
    sessionId: bookedSessionGroup[0].sessionId._id.toString(),
    sessionModel: bookedSessionGroup[0].sessionModel,
    sessionName: bookedSessionGroup[0].sessionId.sessionName,
    sessionType: bookedSessionGroup[0].sessionId.sessionType,
    slotId: bookedSessionGroup[0].slotId.toString(),
    date: bookedSessionGroup[0].date.toString(),
    startTime: bookedSessionGroup[0].startTime,
    endTime: bookedSessionGroup[0].endTime,
    isbookedSessionGroup: bookedSessionGroup.length > 1,
    participants: bookedSessionGroup.map((g) => ({
      bookingSessionId: g._id.toString(),
      userId: g.userId._id.toString(),
      name: g.userId.name,
      email: g.userId.email,
      attendance: g.attendance,
    })),
  };
};
