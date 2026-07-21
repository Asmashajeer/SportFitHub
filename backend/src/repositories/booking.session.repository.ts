import { IBookingSession } from '@/models/booking.session.model';

import { BaseRepository } from './base.repository';
import { ClientSession, Model, Types, UpdateQuery } from 'mongoose';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { FilterQuery } from 'mongoose';
import { BOOKING_SESSION_STATUS } from '@/constants/enums';

export class BookingSessionRepository extends BaseRepository<IBookingSession> implements IBookingSessionRepository {
  constructor(model: Model<IBookingSession>) {
    super(model);
  }

  async enrolledCount(filter: FilterQuery<IBookingSession>): Promise<number> {
    return await this.model.countDocuments(filter);
  }
  async createSessionBooking(data: Partial<IBookingSession>, session: ClientSession) {
    // Note: When using sessions, .create() must take an array
    const [bookingSession] = await this.model.create([data], { session });
    return bookingSession;
  }
  async findByBookingSessionId(id: string | Types.ObjectId) {
    const bookedSession = await this.model.findById(id).populate('sessionId', '_id trainerId sessionName').lean().exec();
    return bookedSession;
  }
  async findUserSessions(filter: FilterQuery<IBookingSession>) {
    const sessions = await this.model
      .find(filter)
      .populate('bookingId', ' _id venue')
      .populate('sessionId', '_id trainerId sessionName sessionType maxCapacity bookingDeadline cancellationWindow')
      .lean()
      .exec();
    return sessions;
  }

  async bookingsessionsStatusInfo(bookingIds: string[]) {
    const objectIds = bookingIds.map((id) => new Types.ObjectId(id));
    const counts = await this.model.aggregate([
      { $match: { bookingId: { $in: objectIds } } },
      {
        $group: {
          _id: '$bookingId',
          scheduledCount: { $sum: { $cond: [{ $eq: ['$status', BOOKING_SESSION_STATUS.SCHEDULED] }, 1, 0] } },
          cancelledCount: { $sum: { $cond: [{ $eq: ['$status', BOOKING_SESSION_STATUS.CANCELLED] }, 1, 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', BOOKING_SESSION_STATUS.COMPLETED] }, 1, 0] } },
        },
      },
    ]);
    return counts;
  }
  async updateSessionBookingStatus(id: string | Types.ObjectId, updateQuery: UpdateQuery<IBookingSession>, session: ClientSession) {
    return await this.model.findByIdAndUpdate(id, updateQuery, { session, new: true });
  }

  async findBookedSessionsPopulatedUser(filter: FilterQuery<IBookingSession> = {}, options: { skip?: number; limit?: number } = { skip: 0, limit: 0 }) {
    const sessions = await this.model
      .find(filter)
      .populate('userId')
      .populate('bookingId', 'pricePlan  venue')
      .populate('sessionId', '_id trainerId sessionName sessionType maxCapacity bookingDeadline cancellationWindow')
      .lean()
      .sort({ createdAt: 1 })
      .skip(options?.skip)
      .limit(options?.limit)
      .exec();

    return sessions;
  }

  //--------------------byBookingId----------------------
  async findAllByBookingId(id: string | Types.ObjectId) {
    const sessions = await this.model.find({ bookingId: id }).sort({ date: 1 });
    return sessions;
  }

  async autoCompleteExpiredSessions() {
    return await this.model.updateMany(
      {
        status: 'scheduled',
        endDateTime: { $lt: new Date() },
      },
      { $set: { status: 'completed' } }
    );
  }

  //--------------------find sessionOccurance by trainerId
  async findOccuredSessions(filter: FilterQuery<IBookingSession>, options: { skip?: number; limit?: number } = { skip: 0, limit: 0 }) {
    const { date } = filter;
    return await this.model
      .find({
        ...filter,
        date: { $lte: date },
      })
      // .populate('userId', '_id name email')
      .populate<{ userId: { _id: Types.ObjectId; name: string; email: string } }>('userId')
      .populate<{ sessionId: { _id: Types.ObjectId; sessionName: string; sessionType: string } }>('sessionId')
      .sort({ startTime: 1 })
      .skip(options?.skip)
      .limit(options?.limit)
      .exec();
  }
  async markAttendance(sessionId: string, bookingSessionId: string, attendance: boolean) {
    return await this.model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(bookingSessionId),
          sessionId: new Types.ObjectId(sessionId),
        },
        { attendance },
        { new: true }
      )
      .populate<{ userId: { _id: Types.ObjectId; name: string; email: string } }>('userId')
      .populate<{ sessionId: { _id: Types.ObjectId; sessionName: string; sessionType: string } }>('sessionId');
  }
}
