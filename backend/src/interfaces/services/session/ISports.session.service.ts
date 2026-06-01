import { GetSessionsResponseDTO, PaginatedSportsSessionsResponseDTO, SportSessionDetailedPublicDTO,  SportsSessionResponseDTO } from '@/dtos/response/session/sports.session.response.dto';
import { ISportsSession } from '@/models/sportsSession.model';
import { FilterQuery, Types } from 'mongoose';

export interface ISportsSessionService {
  createSportSession(sessionData: Partial<ISportsSession>): Promise<SportsSessionResponseDTO>;
  updateSportSession(id: string | Types.ObjectId,sessionData: Partial<ISportsSession>): Promise<SportsSessionResponseDTO>;
  deleteSportSession(id: string | Types.ObjectId): Promise<SportsSessionResponseDTO>
  getSessionsByTrainer(userId: string | Types.ObjectId,filters: FilterQuery<ISportsSession>): Promise<PaginatedSportsSessionsResponseDTO> 
  getAllSessions(filters: FilterQuery<ISportsSession>): Promise<GetSessionsResponseDTO>
  getASession(id:string|Types.ObjectId):Promise<SportSessionDetailedPublicDTO>
  
}
