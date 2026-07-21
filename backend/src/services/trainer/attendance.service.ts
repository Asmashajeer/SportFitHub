import { BOOKING_SESSION_STATUS, PAGINATION_LIMIT } from '@/constants/enums';
import { IBookedSessionPopulateUser } from '@/dtos/request/booking/booking.request.dto';
import { AttendanceMarkingRequestDTO, SessionOccuranceRequestDTO } from '@/dtos/request/trainer/trainer.attendance.request';
import { SessionOccuranceResponseDTO } from '@/dtos/response/booking/booking.response.dto';
import { IAttendanceService } from '@/interfaces/services/trainer/IAttendance.service';
import { toSessionOccuranceResponseDTO } from '@/mappers/booking/booking.mapper';
import { BookingSessionRepository } from '@/repositories/booking.session.repository';
import AppError from '@/utils/AppError';

export class AttendanceService implements IAttendanceService {
  private _bookingSessionRepo: BookingSessionRepository;

  constructor(bookingSessionRepo: BookingSessionRepository) {
    this._bookingSessionRepo = bookingSessionRepo;
  }
  async getSessionOccurrences(data: SessionOccuranceRequestDTO): Promise<SessionOccuranceResponseDTO[]> {
    const { trainerId, page, sessionModel, date, status } = data;
    const limit = PAGINATION_LIMIT;
    const skip = (page - 1) * limit;

    const today = new Date();
    const bookings = await this._bookingSessionRepo.findOccuredSessions(
      {
        trainerId,
        date: date ? date : today,
        status: status ? status : BOOKING_SESSION_STATUS.COMPLETED,
        attendance: null,
      },
      { skip, limit }
    );
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

  async markAttendance(data: AttendanceMarkingRequestDTO): Promise<SessionOccuranceResponseDTO[]> {
    const sessionId = data.sessionId;

    const bookings = await Promise.all(data.records.map((r) => this._bookingSessionRepo.markAttendance(sessionId, r.bookingSessionId, r.attendance)));

    if (bookings.some((b) => b === null)) {
      throw new AppError('One or more bookings not found');
    }

    const grouped = new Map<string, IBookedSessionPopulateUser[]>();
    for (const booking of bookings) {
      const key = `${booking.sessionId._id}-${booking.date}-${booking.slotId}`;
      if (!grouped.has(key)) grouped.set(key, []);
      (grouped.get(key) as typeof bookings).push(booking);
    }
    const groupedSessions = Array.from(grouped.values()).map((group) => toSessionOccuranceResponseDTO(group));
    return groupedSessions;
  }
}
