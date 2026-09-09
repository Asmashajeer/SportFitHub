import { ISportsSession } from '@/models/sportsSession.model';
import { BaseRepository } from './base.repository';
import { ClientSession, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { PaginatedSessions } from '@/dtos/response/session/sports.session.response.dto';

export class SportsSessionRepository extends BaseRepository<ISportsSession> implements ISportsSessionRepository {
  constructor(model: Model<ISportsSession>) {
    super(model);
  }

  // --------------find sessions by trainer with pagination
  async findByTrainer(query: FilterQuery<ISportsSession> = {}): Promise<PaginatedSessions> | null {
    const { page, limit, ...filter } = query;
    const skip = (page - 1) * limit;
    const sessions = await this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalSessions = await this.model.countDocuments(filter);
    return {
      sessions,
      pagination: {
        page,
        total: totalSessions,
        totalPages: Math.ceil(totalSessions / limit),
      },
    };
  }

  //------------------get all sports sessions---public Listing-----
  async findAll(query: FilterQuery<ISportsSession> = {}, options: { page: number; limit: number }) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const sessions = await this.model
      .find(query)
      .populate('sportCategory', '_id sportName icon slug')
      // .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalSessions = await this.model.countDocuments(query);
    return {
      sessions,
      pagination: {
        page,
        total: totalSessions,
        totalPages: Math.ceil(totalSessions / limit),
      },
    };
  }

  // ------------------get session Details---
  async findBysessionId(sessionId: string | Types.ObjectId) {
    const objectId = typeof sessionId === 'string' ? new Types.ObjectId(sessionId) : sessionId;

    const session = await this.model
      .findOne({ _id: objectId })
      .populate('sportCategory', '_id sportName icon slug')
      .populate('trainerId', 'userId displayName profilePic coreDiscipline specialties experience languages averageRating ')
      .lean()
      .exec();

    return session;
  }

  //---------------------find all sessions by a trainer
  async findSessionsByTrainerId(trainerId: string | Types.ObjectId): Promise<ISportsSession[] | null> {
    const sessions = await this.model.find({ trainerId: trainerId });
    return sessions;
  }

  //------------  update enrolledCount
  async updateEnrolledCount(sessionId: string | Types.ObjectId, session: ClientSession): Promise<ISportsSession | null> {
    return await this.model.findOneAndUpdate({ _id: sessionId }, { $inc: { enrolledCount: 1 } }, { session, new: true }).exec();
  }

  async getSessionStats() {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $and: [{ $eq: ['$isApproved', false] }, { $eq: ['$isDeleted', false] }] }, 1, 0] } },
          active: { $sum: { $cond: [{ $and: [{ $eq: ['$isActive', true] }, { $eq: ['$isApproved', true] }] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$isDeleted', true] }, 1, 0] } },
        },
      },
    ]);
    return result[0] ? result[0] : { total: 0, pending: 0, active: 0, inactive: 0, rejected: 0 };
  }

  // ------------------find  All sessions by Admin----------
  async findAllWithTrainer(filter: FilterQuery<ISportsSession>, options: { skip: number; limit: number }) {
    const sessions = await this.model
      .find(filter)
      .populate('trainerId', 'displayName')
      .populate('sportCategory', 'sportName')
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return sessions;
  }

  // ------------------find session by ID by admin
  async findBysessionIdwithTrainerDetails(sessionId: string | Types.ObjectId) {
    const objectId = typeof sessionId === 'string' ? new Types.ObjectId(sessionId) : sessionId;

    const session = await this.model
      .findOne({ _id: objectId })
      .populate('sportCategory', '_id sportName icon slug')
      .populate('trainerId', 'displayName profilePic coreDiscipline specialties experience languages averageRating idVerification.verified certificationInfo.verified createdAt')
      .lean()
      .exec();

    return session;
  }

  async updateSession(id: string | Types.ObjectId, sessionData: UpdateQuery<ISportsSession>) {
    const { images, ...restData } = sessionData;
    const updateQuery: UpdateQuery<ISportsSession> = {
      $set: restData,
    };

    if (images && images.length > 0) {
      updateQuery.$addToSet = {
        images: { $each: images },
      };
    }
    return await this.model.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  async deleteASession(id: string | Types.ObjectId) {
    return await this.model.findByIdAndUpdate(id, {
      isDeleted: true,
      isActive: false,
    });
  }




  //   vector Search 
    async vectorSearch(queryEmbedding: number[], limit = 20) {
      return this.model.aggregate([
        {
          $vectorSearch: {
            index: 'sports_vector_index',
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit,
          },
        },
        { $match: { isApproved: true, isActive: true, isDeleted: false } },
        {
          $project: {
            embedding: 0,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ]);
    }


  async countActiveSessions(): Promise<number> {   
    return await this.model.countDocuments({isActive:true,isApproved:true});
  }
}
