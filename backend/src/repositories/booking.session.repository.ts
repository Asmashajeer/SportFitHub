import { IBookingSession } from '@/models/booking.session.model';

import { BaseRepository } from './base.repository';
import { ClientSession, Model, Types, UpdateQuery } from 'mongoose';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { FilterQuery } from 'mongoose';
import { BOOKING_SESSION_STATUS } from '@/constants/enums';
import { BookingDataMetricDTO } from '@/dtos/response/admin/dashboard.dto';

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
      .populate('bookingId', ' _id bookingUID pricePlan.unitPrice ')
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
    //find
    const expiredSessions = await this.model.find({
      status: 'scheduled',
      endDateTime: { $lt: new Date() },
    });
    if (expiredSessions.length === 0) return [];

    const ids = expiredSessions.map((s) => s._id);
    //update
    await this.model.updateMany({ _id: { $in: ids } }, { $set: { status: 'completed' } });

    // Fetch and return the updated documents
    const docs = await this.model
      .find({ _id: { $in: ids } })
      .populate<{ bookingId: { pricePlan: { unitPrice: number } } }>('bookingId', ' pricePlan.unitPrice')
      .lean();
    return docs;
  }

  //--------------------find completed Sessions  by trainerId
  async findOccuredSessions(query: FilterQuery<IBookingSession>) {
    const now = new Date();

    const filter = {
      ...query,
      endDateTime: { $lt: now },
    };

    const sessions = await this.model
      .find(filter)
      .populate<{ userId: { _id: Types.ObjectId; name: string; email: string } }>('userId')
      .populate<{ sessionId: { _id: Types.ObjectId; sessionName: string; sessionType: string } }>('sessionId')
      .sort({ startTime: 1 })
      .exec();

    return sessions;
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
      .populate<{ userId: { _id: Types.ObjectId; name: string; email: string; fcmToken: string } }>('userId')
      .populate<{ sessionId: { _id: Types.ObjectId; sessionName: string; sessionType: string } }>('sessionId')
      .populate<{ trainerId: { _id: Types.ObjectId; displayName: string } }>('trainerId');
  }
  async findOneSession(filter: FilterQuery<IBookingSession>) {
    return await this.model.findOne(filter).populate('sessionId', '_id sessionName').populate('trainerId', '_id  displayName').exec();
  }

  async getRecentBookings(limit: number = 5) {
    const bookings = await this.model
      .find()
      .populate('userId', 'name')
      .populate('sessionId', 'sessionName')
      .populate('trainerId', 'displayName')
      .populate('bookingId', 'pricePlan paymentId') // if Booking stores a paymentId ref
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return bookings;
  }



async getBookingCategoryMetrics(startDate?: Date, endDate?: Date): Promise<BookingDataMetricDTO[]> {
  const dateFilter: FilterQuery<IBookingSession> = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = startDate;
    if (endDate) dateFilter.createdAt.$lte = endDate;
  }

  return this.model.aggregate([
    // ...(Object.keys(dateFilter).length ? [{ $match: dateFilter }] : []),

    // 1. Lookup from SportsSessions
    {
      $lookup: {
        from: "sportssessions",
        localField: "sessionId",
        foreignField: "_id",
        as: "sportSession"
      }
    },

    // 2. Lookup from FitnessSessions
    {
      $lookup: {
        from: "fitnesssessions",
        localField: "sessionId",
        foreignField: "_id",
        as: "fitnessSession"
      }
    },

    // 3. Merge dynamic session collections into one object
    {
      $addFields: {
        sessionObj: {
          $arrayElemAt: [
            { $concatArrays: ["$sportSession", "$fitnessSession"] },
            0
          ]
        }
      }
    },

    // 4. Get the raw categoryId (whichever field is populated)
    {
      $addFields: {
        categoryId: {
          $ifNull: [
            "$sessionObj.sportCategory",
            "$sessionObj.fitnessCategory",
            null
          ]
        }
      }
    },

    // 5a. Resolve against "sportsmodels" collection
    {
      $lookup: {
        from: "sportsmodels",
        localField: "categoryId",
        foreignField: "_id",
        as: "sportCategoryDoc",
        pipeline: [{ $project: { sportName: 1 } }]
      }
    },

    // 5b. Resolve against "fitnessprogrammodals" collection
    {
      $lookup: {
        from: "fitnessprogrammodals",
        localField: "categoryId",
        foreignField: "_id",
        as: "fitnessCategoryDoc",
        pipeline: [{ $project: { programName: 1 } }]
      }
    },

    // 6. Merge both category lookups into one resolved name
    {
      $addFields: {
        category: {
          $ifNull: [
            { $arrayElemAt: ["$sportCategoryDoc.sportName", 0] },
            { $arrayElemAt: ["$fitnessCategoryDoc.programName", 0] },
            "Uncategorized"
          ]
        }
      }
    },

    // 7. Lookup bookingId with pricePlan projection
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
        pipeline: [
          { $project: { "pricePlan.unitPrice": 1 } }
        ]
      }
    },
    {
      $unwind: { path: "$booking", preserveNullAndEmptyArrays: true }
    },

    // 8. Group by category
    {
      $group: {
        _id: "$category",
        totalRevenue: { $sum: { $ifNull: ["$booking.pricePlan.unitPrice", 0] } },
        totalSessions: { $sum: 1 }
      }
    },

    // 9. Rename to match chart consumer shape { name, value }
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$totalRevenue"
      }
    },

    { $sort: { value: -1 } }
  ]);
}
}
  


