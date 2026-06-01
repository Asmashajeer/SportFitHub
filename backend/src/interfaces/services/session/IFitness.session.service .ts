import { FilterQuery, Types } from "mongoose";

import { IFitnessSession } from "@/models/fitnessSession.model";
import { FitnessSessionDetailedPublicDTO, FitnessSessionResponseDTO, GetFitnessSessionsResponseDTO, PaginatedFitnessSessionsResponseDTO } from "@/dtos/response/session/fitness.session.response.dto";

export interface IFitnessSessionService{
   createFitnessSession(sessionData: Partial<IFitnessSession>): Promise<FitnessSessionResponseDTO>;
     updateFitnessSession(id: string | Types.ObjectId,sessionData: Partial<IFitnessSession>): Promise<FitnessSessionResponseDTO>;
     deleteFitnessSession(id: string | Types.ObjectId): Promise<FitnessSessionResponseDTO>
    getSessionsByTrainer(userId: string | Types.ObjectId,filters: FilterQuery<IFitnessSession>): Promise<PaginatedFitnessSessionsResponseDTO> 
     getAllSessions(filters: FilterQuery<IFitnessSession>): Promise<GetFitnessSessionsResponseDTO>
     getASession(id:string|Types.ObjectId):Promise<FitnessSessionDetailedPublicDTO>
}