import { getQueryDTO, SportRequestDTO } from "@/dtos/request/admin/admin.category.dto";
import { SportsResponseDTO } from "@/dtos/response/admin/sports.response.dto";
import { Types } from "mongoose";

export interface ISportsManagementService{
    addSports(data:SportRequestDTO):Promise<SportsResponseDTO>
    getSports(filter:getQueryDTO):Promise<SportsResponseDTO[]>
    getSport(id:string|Types.ObjectId):Promise<SportsResponseDTO>
    toggleSportStatus(id:string|Types.ObjectId):Promise<SportsResponseDTO>
    updateSport(id:string|Types.ObjectId,sportData:SportRequestDTO):Promise<SportsResponseDTO>
     deleteSport(id:string|Types.ObjectId):Promise<boolean>
}