import { IBookedSessionPopulateUser } from "@/dtos/request/booking/booking.request.dto";

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


export const toMarkAttendanceResponseDTO=(bookedSession)=>{
    return{
      id: bookedSession._id.toString(),
      bookingId: bookedSession.bookingId,
      userId: bookedSession.userId._id.toString(),
      trainerId: bookedSession.trainerId._id.toString(),
      sessionId: bookedSession.sessionId._id.toString(),
      sessionModel: bookedSession.sessionModel,
      status: bookedSession.status,
      attendance:bookedSession.attendace
    
  }
}