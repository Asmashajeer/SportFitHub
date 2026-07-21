import { IBooking } from '@/models/booking.model';
import { ClientSession, FilterQuery, Types } from 'mongoose';
import { IBaseRepository } from './IBase.repository';

export interface IBookingRepository extends IBaseRepository<IBooking> {
  createBooking(data: Partial<IBooking>, session: ClientSession);
  updateBooking(id: string, data: Partial<IBooking>, session: ClientSession);
  // findBooking(filter:FilterQuery<IBooking>,session: ClientSession)
  enrolledCount(filter: FilterQuery<IBooking>): Promise<number>;
  findBySessionId(stripeSessionId: string | Types.ObjectId): Promise<IBooking | null>;
  findByUserId(filter: FilterQuery<IBooking>): Promise<IBooking[] | null>;
  getBookingsStats();
  findAllBookings(filter: FilterQuery<IBooking>, options: { skip: number; limit: number; search: string });
  findByIdwithDetails(id: string | Types.ObjectId);
}
