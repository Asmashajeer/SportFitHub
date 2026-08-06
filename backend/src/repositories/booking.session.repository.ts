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
      .populate('trainerId', '_id userId displayName')
      .populate('sessionId', '_id trainerId sessionName sessionType maxCapacity bookingDeadline cancellationWindow')
      .sort({ date: -1 }) 
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

  //--------------------find completed Sessions  by trainerId
  async findOccuredSessions(query: FilterQuery<IBookingSession>) {  
    const now = new Date();
     
    
    const filter={
      ...query,
       endDateTime: { $lt:now },
    }
   
   const  sessions= await this.model.find(filter)
      .populate<{ userId: { _id: Types.ObjectId; name: string; email: string } }>('userId')
      .populate<{ sessionId: { _id: Types.ObjectId; sessionName: string; sessionType: string } }>('sessionId')
      .sort({ startTime: 1 })      
      .exec();
   
      return sessions
  }



  //------------mark Attendance-----------------
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
      .populate<{ userId: { _id: Types.ObjectId; name: string; email: string ,fcmToken:string} }>('userId')
      .populate<{ sessionId: { _id: Types.ObjectId; sessionName: string; sessionType: string } }>('sessionId')
      .populate<{ trainerId: { _id: Types.ObjectId; displayName: string} }>('trainerId');
  }
  async findOneSession(filter:FilterQuery<IBookingSession>){
      return await this.model.findOne(filter)
      .populate('sessionId', '_id sessionName')
      .populate('trainerId', '_id  displayName')
      .exec();
  }
  


   

}
