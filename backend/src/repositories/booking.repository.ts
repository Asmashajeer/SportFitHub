import { IBooking } from '@/models/booking.model';
import { BaseRepository } from './base.repository';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { IBookingRepository } from '@/interfaces/repositories/IBooking.repository';
import { BOOKING_STATUS } from '@/constants/enums';

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor(model: Model<IBooking>) {
    super(model);
  }
  async createBooking(data: Partial<IBooking>, session: ClientSession) {
    // Note: When using sessions, .create() must take an array
    const [booking] = await this.model.create([data], { session });
    return booking;
  }
  async updateBooking(id: string, data: Partial<IBooking>, session: ClientSession) {
    return await this.model.findByIdAndUpdate(id, data, { session, new: true });
  }

  async enrolledCount(filter: FilterQuery<IBooking>): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async findBySessionId(stripeSessionId: string): Promise<IBooking | null> {
    return await this.model.findOne({ stripeSessionId: stripeSessionId }).populate('paymentId', '_id receiptUrl');
  }
  async findByUserId(filter: FilterQuery<IBooking>): Promise<IBooking[] | null> {
    return await this.model.find(filter).populate('paymentId', '_id receiptUrl');
  }

  // ---------------bookings Stats----------------
  async getBookingsStats() {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', BOOKING_STATUS.PENDING] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', BOOKING_STATUS.COMPLETED] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', BOOKING_STATUS.CANCELLED] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', BOOKING_STATUS.CONFIRMED] }, 1, 0] } },
        },
      },
    ]);

    return result[0] ?? { total: 0, pending: 0, completed: 0, cancelled: 0, confirmed: 0 };
  }

  // ------------------find All Bookings by admin------
  // async findAllBookings(filter: FilterQuery<IBooking>, options: { skip: number; limit: number }    ) {
  // const bookings = await this.model.find(filter)
  //   .populate("userId","name email")
  //   .populate('sessionId','_id trainerId sessionName sessionType')
  //   .sort({ createdAt: -1 })
  //   .skip(options.skip)
  //   .limit(options.limit)
  //   .lean()
  //   .exec();

  //   return bookings;
  // }

  async findAllBookings(filter: FilterQuery<IBooking>, options: { skip: number; limit: number; search: string }) {
    const { skip, limit, search } = options;

    const bookings = await this.model.aggregate([
      { $match: filter },
      //user
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      //  sportsSession
      {
        $lookup: {
          from: 'sportssessions',
          localField: 'sessionId',
          foreignField: '_id',
          as: 'sportSession',
        },
      },
      // fitnessSesssion
      {
        $lookup: {
          from: 'fitnesssessions',
          localField: 'sessionId',
          foreignField: '_id',
          as: 'fitnessSession',
        },
      },
      {
        $addFields: {
          sessionDoc: {
            $ifNull: [{ $arrayElemAt: ['$sportSession', 0] }, { $arrayElemAt: ['$fitnessSession', 0] }],
          },
        },
      },
      ...(search
        ? [
            {
              $match: {
                $or: [{ 'sessionDoc.sessionName': { $regex: search, $options: 'i' } }, { 'user.name': { $regex: search, $options: 'i' } }, { 'user.email': { $regex: search, $options: 'i' } }],
              },
            },
          ]
        : []),
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 0,
          bookingId: '$_id',
          bookingUId: '$bookingUId',
          userName: '$user.name',
          userEmail: '$user.email',
          sessionName: '$sessionDoc.sessionName',
          sessionType: '$sessionDoc.sessionType',
          trainerId: '$sessionDoc.trainerId',
          venue: 1,
          sessionModel: 1,
          pricePlan: 1,
          status: 1,
          createdAt: 1,
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);
    return bookings;
  }

  //----------------booking details by admin-----------
  async findByIdwithDetails(id: string | Types.ObjectId) {
    console.log('in booking repo');
    const booking = await this.model.findById(id).populate('userId', '_id name email').populate('paymentId', '_id').populate('sessionId', 'sessionName trainerId sessionType');

    return booking;
  }
}
