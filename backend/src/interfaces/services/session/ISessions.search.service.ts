import { SessionPublicResponseDTO } from "@/dtos/response/session/session.response.dto";

 export interface ISessionsSearchService{
    searchSessions(query: string): Promise<SessionPublicResponseDTO[]>
 }