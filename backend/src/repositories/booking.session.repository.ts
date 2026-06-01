import  { IBookingSession } from "@/models/booking.session.model";

import { BaseRepository } from "./base.repository";
import { ClientSession, Model, Types, UpdateQuery } from "mongoose";
import { IBookingSessionRepository } from "@/interfaces/repositories/IBook.session.repository";
import { FilterQuery } from "mongoose";

export class BookingSessionRepository extends BaseRepository<IBookingSession> implements IBookingSessionRepository{
    constructor(model:Model<IBookingSession>){
        super(model);
    }

    async enrolledCount(filter :FilterQuery<IBookingSession>):Promise<number>{
        return await this.model.countDocuments(filter);
    }
     async createSessionBooking(data: Partial<IBookingSession>, session: ClientSession) {
            // Note: When using sessions, .create() must take an array
            const [bookingSession] = await this.model.create([data], { session });
            return bookingSession;
          }

    async findUserSessions(filter:FilterQuery<IBookingSession>){
        const sessions=await this.model.find(filter)
        .populate('bookingId', '  venue')
        .populate('sessionId','_id trainerId sessionName sessionType maxCapacity bookingDeadline cancellationWindow')
        .lean()
        .exec();
        return sessions;
    }

    
    async updateSessionBookingStatus( id:string|Types.ObjectId,updateQuery:UpdateQuery<IBookingSession>, session: ClientSession){
        return await this.model.findByIdAndUpdate(id,updateQuery, { session, new: true });
    }

    async findBookedSessionsPopulatedUser(filter:FilterQuery<IBookingSession> = {},options: { skip: number; limit: number }){
        const sessions=await this.model.find(filter)
        .populate('userId', '_id name email')
        .populate('bookingId', '  venue')
        .populate('sessionId','_id trainerId sessionName sessionType maxCapacity bookingDeadline cancellationWindow')
        .lean()
        .sort({ createdAt: 1 })
        .skip(options.skip)
        .limit(options.limit)
        .exec();   
      
        return sessions;
    }

//--------------------byBookingId----------------------
    async findAllByBookingId(id:string|Types.ObjectId){
        const sessions = await this.model.find({ bookingId: id })            
            .sort({ date: 1 });
        return sessions;
    }
   
}