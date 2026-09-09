import { IFitnessSession } from '@/models/fitnessSession.model';
import { BaseRepository } from './base.repository';
import { ClientSession, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { PaginatedSessions } from '@/dtos/response/session/fitness.session.response.dto';

export class FitnessSessionRepository extends BaseRepository<IFitnessSession> implements IFitnessSessionRepository {
  constructor(model: Model<IFitnessSession>) {
    super(model);
  }

  async findByTrainer(query: FilterQuery<IFitnessSession> = {}): Promise<PaginatedSessions> | null {
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
  // ---------------------All Sessions------------
  async findAll(query: FilterQuery<IFitnessSession> = {}, options: { page: number; limit: number }) {   
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const sessions = await this.model.find(query).populate('fitnessCategory', '_id programName  slug').skip(skip).limit(limit).lean().exec();
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
  // -------------------get a session-Details--------------
  async findBysessionId(sessionId: string | Types.ObjectId) {
    const objectId = typeof sessionId === 'string' ? new Types.ObjectId(sessionId) : sessionId;

    const session = await this.model
      .findOne({ _id: objectId })
      .populate('fitnessCategory', '_id programName slug')
      .populate('trainerId', 'userId displayName profilePic coreDiscipline specialties experience languages averageRating')
      .lean()
      .exec();

    return session;
  }

  //find all sessions by a trainer
  async findSessionsByTrainerId(trainerId: string | Types.ObjectId): Promise<IFitnessSession[] | null> {
    const sessions = await this.model.find({ trainerId: trainerId });
    return sessions;
  }

  //  update enrolledCount
  async updateEnrolledCount(sessionId: string | Types.ObjectId, session: ClientSession): Promise<IFitnessSession | null> {
    // const objectId =  typeof sessionId === 'string' ? new Types.ObjectId(sessionId) : sessionId;
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

  //-------------------all sessions with trainer details--------
  async findAllWithTrainer(filter: FilterQuery<IFitnessSession>, options: { skip: number; limit: number }) {
    const sessions = await this.model
      .find(filter)
      .populate('trainerId', 'displayName')
      .populate('fitnessCategory', 'programName')
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();
    return sessions;
  }

  // -------------------get a session--by admin-------------
  async findBysessionIdwithTrainerDetails(sessionId: string | Types.ObjectId) {
    const objectId = typeof sessionId === 'string' ? new Types.ObjectId(sessionId) : sessionId;

    const session = await this.model
      .findOne({ _id: objectId })
      .populate('fitnessCategory', '_id programName slug')
      .populate('trainerId', 'displayName profilePic coreDiscipline specialties experience languages averageRating idVerification.verified certificationInfo.verified createdAt')
      .lean()
      .exec();

    return session;
  }

  //--------update
  async updateSession(id: string | Types.ObjectId, sessionData: UpdateQuery<IFitnessSession>) {
    const { images, ...restData } = sessionData;
    const updateQuery: UpdateQuery<IFitnessSession> = {
      $set: restData,
    };

    if (images && images.length > 0) {
      updateQuery.$addToSet = {
        images: { $each: images },
      };
    }
    return await this.model.findByIdAndUpdate(id, updateQuery, { new: true });
  }



  //----------delete
  async deleteASession(id: string | Types.ObjectId) {
    return await this.model.findByIdAndUpdate(id, {
      isDeleted: true,
      isActive: false,
    });
  }

// -------vector Search
    async vectorSearch(queryEmbedding: number[], limit = 20) {
      return this.model.aggregate([
        {
          $vectorSearch: {
            index: 'fitness_vector_index',
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
