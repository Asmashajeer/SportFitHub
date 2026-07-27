import { Review_Type } from "@/constants/enums";
import { Types } from "mongoose";

export interface ReviewRequestDTO{ 
  
  rating: number;                
  review?: string;
  userId: string| Types.ObjectId;                
  reviewableType: typeof Review_Type[keyof typeof Review_Type];
  reviewableId: string| Types.ObjectId;          
 
}

export interface ReviewPromptRequestDTO{
  userId:string,
  reviewableType: Review_Type; 
  reviewableId: string;     
}
export interface SessionReviewPromptRequestDTO{
      userId:string,
      name:string,
      email:string,
      fcmToken:string,
      sessionId:string,
      sessionName:string,
      sessionModel:string,
      trainerId:string
      trainerName:string
}




