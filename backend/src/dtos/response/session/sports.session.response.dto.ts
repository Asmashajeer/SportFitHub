import { AGE_GROUP, DAY, SESSION_MODE, SESSION_TYPE } from "@/constants/enums";
import { ISportsSession } from "@/models/sportsSession.model";

import { Types } from "mongoose";
import { PaginationResponseDTO } from "../pagination.response.dto";



export interface IPopulatedSport {
  _id: Types.ObjectId;
  sportName: string;
  icon?: string;
  slug: string;
}
export interface IVenue {
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface ITimeSlot {
  day: DAY;
 slots:{
          startTime: string; // "09:00"
          endTime: string;   // "10:00"
          _id?:string
  }[],
   _id?:string
}

export interface IPricing {
  sessionCount: number;
  price: number;
   _id?:string
}


export interface ISportsSessionPopulated  {
    _id:Types.ObjectId;
    trainerId: Types.ObjectId;
    sportCategory: IPopulatedSport;
    sessionName: string;
    slug:string;
    description: string;
    duration: number;
    ageGroup: AGE_GROUP;
    sessionType: SESSION_TYPE;
    enrolledCount: number;
    maxCapacity: number;
    mode:SESSION_MODE;
    meetingLink?:string;   // Required if mode === ONLINE
    venue?: IVenue;         // Required if mode === OFFLINE
    amenities?: string[];   // Required if mode === OFFLINE
    timeSlots: ITimeSlot[];
    pricing: IPricing[];
    cancellationPolicy: string; 
    cancellationWindow:  number,
    bookingDeadline: number;
    isActive: boolean;
    isDeleted: boolean;
    isApproved: boolean;
    images: string[];
    rating:number,   
    updatedAt: Date;
     createdAt: Date;
};

export interface IPopulatedTrainer{
   _id: Types.ObjectId;
   displayName: string;
   profilePic: string;
   coreDiscipline: string;
   specialties: string[];
   experience: number;
   languages: string[];
   averageRating: number;
}
export interface  ISportsSessionDetailsPopulated extends Omit<ISportsSessionPopulated, 'trainerId'> {
  trainerId:IPopulatedTrainer
}



export interface SportsSessionResponseDTO{
   id:string
   trainerId: string;
   sportCategory:string,
   sessionName: string;
   slug:string,
   description: string;
   duration: number;
   ageGroup: AGE_GROUP;
   sessionType: SESSION_TYPE;
   maxCapacity: number;
   enrolledCount: number;
   mode:SESSION_MODE;
   meetingLink?:string; 
   venue: IVenue;
   amenities: string[];
   timeSlots: ITimeSlot[];
   pricing: IPricing[];
   cancellationPolicy: string; 
  cancellationWindow:  number,
  bookingDeadline: number;
   isActive: boolean;
   isDeleted: boolean;
   isApproved: boolean;
   images: string[];
   rating:number,
   createdAt: string;
   updatedAt: string;
}




export interface SportsCategory extends Omit<IPopulatedSport ,'_id'>{
  id:string,  
}

export interface PopulatedTrainer extends Omit<IPopulatedTrainer ,'_id'>{
  id:string,  
}
export interface SportSessionPublicDTO extends Omit<SportsSessionResponseDTO,'sportCategory'>{
   sportCategory:SportsCategory
}
export interface SportSessionDetailedPublicDTO extends Omit<SportsSessionResponseDTO,'sportCategory'|'trainerId'>{
  sportCategory:SportsCategory,
  trainer:PopulatedTrainer
}



export interface GetSessionsResponseDTO {  
  sessions: SportSessionPublicDTO[]; // The data
  pagination: PaginationResponseDTO;    // The metadata
}
  export interface PaginatedSessions {
  sessions: ISportsSession[];
  pagination: PaginationResponseDTO;
}
export interface PaginatedSportsSessionsResponseDTO {
  sessions: SportsSessionResponseDTO[];
  pagination: PaginationResponseDTO;
}