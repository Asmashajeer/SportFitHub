import { IBookingSession } from '@/models/booking.session.model';
import { IBaseRepository } from './IBase.repository';
import { ClientSession, FilterQuery, Types } from 'mongoose';
import { UpdateQuery } from 'mongoose';

export interface IBookingSessionRepository extends IBaseRepository<IBookingSession> {
  enrolledCount(filter: FilterQuery<IBookingSession>): Promise<number>;
  createSessionBooking(data: Partial<IBookingSession>, session: ClientSession);
  findByBookingSessionId(id: string | Types.ObjectId);
  findUserSessions(filter: FilterQuery<IBookingSession>);
  bookingsessionsStatusInfo(bookingIds: string[]);
  updateSessionBookingStatus(id: string | Types.ObjectId, updateQuery: UpdateQuery<IBookingSession>, session: ClientSession);
  findBookedSessionsPopulatedUser(filter: FilterQuery<IBookingSession>, options?: { skip?: number; limit?: number });
  findAllByBookingId(id: string | Types.ObjectId);
  findOccuredSessions(filter: FilterQuery<IBookingSession>, options: { skip?: number; limit?: number });
  autoCompleteExpiredSessions();
  findOneSession(userId:string | Types.ObjectId, sessionId:string | Types.ObjectId,attendance:boolean)
}
