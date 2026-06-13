import { ISportsSession } from "@/models/sportsSession.model";
import { IBaseRepository } from "./IBase.repository";
import { ClientSession, FilterQuery, Types } from "mongoose";
import { PaginatedSessions } from "@/dtos/response/session/sports.session.response.dto";

export interface ISportsSessionRepository extends IBaseRepository<ISportsSession>{
    findByTrainer(query:FilterQuery<ISportsSession>): Promise<PaginatedSessions> | null 
  findAll(query: FilterQuery<ISportsSession> ,options:{page:number,limit:number})
     findBysessionId(sessionId: string|Types.ObjectId)
    findSessionsByTrainerId(profileId:string | Types.ObjectId):Promise<ISportsSession[]|null>
    updateEnrolledCount(sessionId:string | Types.ObjectId,session: ClientSession):Promise<ISportsSession|null>
    getSessionStats() ;
    findAllWithTrainer(filter: FilterQuery<ISportsSession>, options: { skip: number; limit: number }    ) 
    findBysessionIdwithTrainerDetails(sessionId: string | Types.ObjectId)
    deleteASession(id: string| Types.ObjectId )
}