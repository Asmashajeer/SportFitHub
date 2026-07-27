import { PAYLOAD_MODEL, Review_Type } from "@/constants/enums";

export interface ReviewResponseDTO{   
  id: string;
  rating: number;                
  review?: string;
  userId: string;                
  reviewableType: typeof Review_Type[keyof typeof Review_Type];
  reviewableId: string;          
  createdAt: string;
  updatedAt: string;
}


export interface IRatingAggregateResult {
  _id: string;                   
  avgRating: number;
  count: number;
}

export interface RatingAggregateResult extends Omit<IRatingAggregateResult,'_id'>{
    id:string;
}

export interface PendingReviewResponseDTO{
          sessionId: string,
          sessionName: string,
          sessionModel:typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL],
          
          trainerId: string,
          date: string,
}

export interface SessionResponseForReviewDTO extends PendingReviewResponseDTO {         
          trainerName: string    
}
export interface ReviewResponsePopulatedUserDTO extends Omit<ReviewResponseDTO,'userId'>{ 
  user:{
    id:string,
    name:string,
    email:string
  }
}