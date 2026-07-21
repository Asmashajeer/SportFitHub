import { AdminBookingsFilterDTO } from '@/dtos/request/admin/admin.bookings.request.dto';
import { AdminBookingDetailDTO, AdminBookingsResponseDTOwithPagination, BookingsStatsResponseDTO } from '@/dtos/response/admin/bookings.response.dto';

import { Types } from 'mongoose';

export interface IBookingsManagementService {
  getBookingstats(): Promise<BookingsStatsResponseDTO>;
  getBookings(filter: AdminBookingsFilterDTO): Promise<AdminBookingsResponseDTOwithPagination>;
  getBookingDetails(bookingId: string | Types.ObjectId): Promise<AdminBookingDetailDTO>;
}
