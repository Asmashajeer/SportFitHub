import { IFitnessSession } from "@/models/fitnessSession.model";
import { ISportsSession } from "@/models/sportsSession.model"
import { Types } from "mongoose";


export interface statsDTO{
    total: number  ,

    pending: number,
    active: number,
    inactive: number,
    rejected: number
}

export interface SessionStatsResponseDTO{
    sportsStats: statsDTO,
   fitnessStats: statsDTO,
   
}
export interface  AdminSessionFilterDTO{
    page:number   ,
    limit:number  ,
    search: string
    status:string  ,
    sessionType:string  ,
    mode:string  ,     
}
interface PopulatedSportCategory {
    _id: Types.ObjectId;
    sportName: string;
}
export interface ISportsSessionDTOWithCategory extends Omit<ISportsSession,'sportCategory'>{
    sportCategory:PopulatedSportCategory;
}
interface PopulatedFitnessCategory {
    _id: Types.ObjectId;
    programName: string;
}
export interface IFitnessSessionDTOWithCategory extends Omit<IFitnessSession,'fitnessCategory'>{
    fitnessCategory:PopulatedFitnessCategory;
}


