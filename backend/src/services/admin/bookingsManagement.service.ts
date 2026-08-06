import { BOOKING_SESSION_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES } from '@/constants/messages';
import { AdminBookingsFilterDTO } from '@/dtos/request/admin/admin.bookings.request.dto';
import { AdminBookingDetailDTO, adminBookingSessionDTOwithUserId, AdminBookingsResponseDTOwithPagination, BookingsStatsResponseDTO } from '@/dtos/response/admin/bookings.response.dto';

import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { IBookingRepository } from '@/interfaces/repositories/IBooking.repository';
import { IBookingsManagementService } from '@/interfaces/services/admin/IBookingsManagement.service';
import { toAdminBookingSessionDTO, toAdminBookingSessionDTOwithUserId, toAdminBookingsResponseDTO } from '@/mappers/admin/admin.bookings.mappers';
import { IBooking } from '@/models/booking.model';
import AppError from '@/utils/AppError';

import { FilterQuery, Types } from 'mongoose';

export class BookingsManagementService implements IBookingsManagementService {
  private _bookingRepo: IBookingRepository;
  private _bookingSessionRepo: IBookingSessionRepository;

  constructor(bookingRepo: IBookingRepository, bookingSessionRepo: IBookingSessionRepository) {
    this._bookingRepo = bookingRepo;
    this._bookingSessionRepo = bookingSessionRepo;
  }

  //-------------------get BookingsStats-----------
  async getBookingstats(): Promise<BookingsStatsResponseDTO> {
    const bookingsStats = await this._bookingRepo.getBookingsStats();
    if (!bookingsStats) throw new AppError('erroe fetching Booking Stats');

    return bookingsStats;
  }

  // ------------------get All Bookings- by admin--------
  async getBookings(filter: AdminBookingsFilterDTO): Promise<AdminBookingsResponseDTOwithPagination> {
    const { page, limit, status, sessionModel, search } = filter;
    const skip = (page - 1) * limit;

    const query: FilterQuery<IBooking> = {};

    if (sessionModel && sessionModel !== 'all') {
      query.sessionModel = sessionModel;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    const [bookings, totalCount] = await Promise.all([this._bookingRepo.findAllBookings(query, { skip, limit, search }), this._bookingRepo.count(query)]);

    return {
      bookings,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
    };
  }

  // ---------- booking Detail with sessions
  async getBookingDetails(bookingId: string | Types.ObjectId): Promise<AdminBookingDetailDTO> {
    const [booking, sessions] = await Promise.all([this._bookingRepo.findByIdwithDetails(bookingId), this._bookingSessionRepo.findAllByBookingId(bookingId)]);

    if (!booking) throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND);
    const bookingData = toAdminBookingsResponseDTO(booking);
    const bookedSessions = sessions.map((session) => toAdminBookingSessionDTO(session));
    return {
      ...bookingData,
      stripeSessionId: booking.stripeSessionId as string,
      paymentId: booking.paymentId.toString(),
      sessions: bookedSessions,
    };
  }

  //--------------get bookingSessions By Admin
  async getBookingSessions(userId: string): Promise<adminBookingSessionDTOwithUserId[]> {
    const sessions = (await this._bookingSessionRepo.find({ userId: userId, status: BOOKING_SESSION_STATUS.SCHEDULED })) ;
    const bookedSessions = sessions.map((session) => toAdminBookingSessionDTOwithUserId(session));
    return bookedSessions;
  }
}
