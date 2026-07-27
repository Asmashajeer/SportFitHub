import { BOOKING_SESSION_STATUS, PAGINATION_LIMIT } from '@/constants/enums';
import { IBookedSessionPopulateUser } from '@/dtos/request/booking/booking.request.dto';
import { AttendanceMarkingRequestDTO, SessionOccuranceRequestDTO } from '@/dtos/request/trainer/trainer.attendance.request';
import { MarkAttendanceResponseDTO, SessionOccuranceResponseDTO } from '@/dtos/response/attendance/attendance.response.dto';

import { IReviewService } from '@/interfaces/services/review/IReview.service';
import { IAttendanceService } from '@/interfaces/services/trainer/IAttendance.service';
import { toMarkAttendanceResponseDTO, toSessionOccuranceResponseDTO } from '@/mappers/attendance.mappers';
import { toSessionReviewPromptRequestDTO } from '@/mappers/review.mapper';
import { IBookingSession } from '@/models/booking.session.model';
import { BookingSessionRepository } from '@/repositories/booking.session.repository';
import AppError from '@/utils/AppError';

import { FilterQuery } from 'mongoose';

export class AttendanceService implements IAttendanceService {
  private _bookingSessionRepo: BookingSessionRepository;
  private _reviewService:IReviewService;
  constructor(bookingSessionRepo: BookingSessionRepository,reviewService:IReviewService) {
    this._bookingSessionRepo = bookingSessionRepo;
     this._reviewService=reviewService;
  }



  //------------------------get completed sessions to mark participants attandance----
  async getSessionOccurrences(data: SessionOccuranceRequestDTO): Promise<SessionOccuranceResponseDTO[]> {
    const { trainerId, page, sessionModel, attendanceMarked } = data;
    const limit = PAGINATION_LIMIT;
    const skip = (page - 1) * limit;

     let query: FilterQuery<IBookingSession>= {
        trainerId,       
        status:BOOKING_SESSION_STATUS.COMPLETED,            
      }
      if( sessionModel){
        query.sessionModel=sessionModel;
      }
      if(!attendanceMarked ){
        query.attendance=null
      }
    
    const bookings = await this._bookingSessionRepo.findOccuredSessions( query, { skip, limit }  );
    if (!bookings || bookings.length === 0) {
      throw new AppError('No completed sessions to mark attendance');
    }
    const grouped = new Map<string, IBookedSessionPopulateUser[]>();
    for (const booking of bookings) {
      const key = `${booking.sessionId}-${booking.date}-${booking.slotId}`;
      if (!grouped.has(key)) grouped.set(key, []);
      (grouped.get(key) as typeof bookings).push(booking);
    }

    const groupedSessions = Array.from(grouped.values()).map((group) => toSessionOccuranceResponseDTO(group));
    return groupedSessions;
  }



  //------------------mark Attendance of participants-----------
  async markAttendance(data: AttendanceMarkingRequestDTO): Promise<MarkAttendanceResponseDTO[]> {
    const sessionId = data.sessionId;

    const bookings = await Promise.all(data.records.map((r) => this._bookingSessionRepo.markAttendance(sessionId, r.bookingSessionId, r.attendance)));
    
    if (bookings.some((b) => b === null)) {
      throw new AppError('One or more bookings not found');
    }
    const attendedSessions=bookings.filter((booking)=>(booking.attendance===true));
    const participants=attendedSessions.map((booking)=>toSessionReviewPromptRequestDTO(booking)); 
    console.log("----------",participants)  ; 
    for(const participant of participants){
      this._reviewService.sendReviewPromptforSession(participant).catch((err)=>console.log('Failed to send review prompt:', err))
    }
    const updatedRecords=bookings.map((booking)=>toMarkAttendanceResponseDTO(booking))   
    return updatedRecords;
  }
}
