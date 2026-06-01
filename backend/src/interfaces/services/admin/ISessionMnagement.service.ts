import {  AdminSessionFilterDTO,  SessionStatsResponseDTO } from "@/dtos/request/admin/admin.session.dto";
import { AdminSessionActionResponseDTO, AdminSessionDetailedViewDTO, AdminSessionsResponseDTO } from "@/dtos/response/admin/session.response.dto";
import { Types } from "mongoose";

export interface ISessionManagementService {
    getSessionStats():Promise<SessionStatsResponseDTO> 
    getSessions(  sessionModel: string,  filter: AdminSessionFilterDTO): Promise<AdminSessionsResponseDTO> 
    getSession(  sessionModel: string,  id:string|Types.ObjectId): Promise<AdminSessionDetailedViewDTO> 
    approveSession(sessionModel:string,id:string,isApproved):Promise<AdminSessionActionResponseDTO>
    activateSession(sessionModel:string,id:string,isActive):Promise<AdminSessionActionResponseDTO>
}