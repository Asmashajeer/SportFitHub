import { IFitnessSession } from '@/models/fitnessSession.model';
import { IBaseRepository } from './IBase.repository';
import { ClientSession, FilterQuery, Types } from 'mongoose';
import { PaginatedSessions } from '@/dtos/response/session/fitness.session.response.dto';
import { UpdateQuery } from 'mongoose';

export interface IFitnessSessionRepository extends IBaseRepository<IFitnessSession> {
  findByTrainer(query: FilterQuery<IFitnessSession>): Promise<PaginatedSessions> | null;
  findAll(query: FilterQuery<IFitnessSession>, options: { page: number; limit: number });
  findBysessionId(sessionId: string | Types.ObjectId);
  updateEnrolledCount(sessionId: string | Types.ObjectId, session: ClientSession): Promise<IFitnessSession | null>;
  getSessionStats();
  findAllWithTrainer(filter: FilterQuery<IFitnessSession>, options: { skip: number; limit: number });
  findBysessionIdwithTrainerDetails(sessionId: string | Types.ObjectId);
  updateSession(id: string | Types.ObjectId, sessionData: UpdateQuery<IFitnessSession>);
  deleteASession(id: string | Types.ObjectId);
}
