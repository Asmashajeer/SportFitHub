import { getTimezone } from "@/context/timezone.context";
import { IRatingAggregateResult } from "@/dtos/response/review/review.response.dto";
import { IReview } from "@/models/review.model";
import { formatInTimeZone } from "date-fns-tz";


export const toSessionReviewPromptRequestDTO=(booking)=>{
    return{
      userId:booking.userId._id.toString(),
      name:booking.userId.name,
      email:booking.userId.email,
      fcmToken:booking.userId.fcmToken,
      sessionId:booking.sessionId._id.toString(),
      sessionName:booking.sessionId.sessionName,
      sessionModel:booking.sessionModel,
      trainerId:booking.trainerId._id.toString,
      trainerName:booking.trainerId.displayName
    }
}

    

export const toReviewResponseDTO=(review:IReview)=>{
    const timezone = getTimezone();
    return{
        id: review._id.toString(),
        rating: review.rating,                
        review:review?review.review:"",
        userId: review.userId.toString(),               
        reviewableType: review.reviewableType,
        reviewableId: review.reviewableId.toString() ,         
        createdAt: formatInTimeZone(review.createdAt, timezone, 'yyyy-MM-dd'),
        updatedAt: formatInTimeZone(review.updatedAt, timezone, 'yyyy-MM-dd'),
    }
}


export const toRatingAggregateResult=(TopReview:IRatingAggregateResult)=>{
    return{
        id:TopReview._id.toString(),                   
        avgRating: TopReview.avgRating,
        count: TopReview.count,
    }
}

export const toPendingReviewResponseDTO=(review)=>{
     const timezone = getTimezone();
    return{
          sessionId: review.sessionId._id.toString(),
          sessionName: review.sessionId.sessionName,
          sessionModel:review.sessionModel,          
          trainerId: review.trainerId.toString(),
          date: formatInTimeZone(review.date, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }
}

export const toSessionResponseForReviewDTO= (review)=>{

    return{
       ...toPendingReviewResponseDTO(review),
        trainerName: review.trainerId.displayName,
    }
}

export const toReviewResponsePopulatedUserDTO=(review)=>{
    const timezone = getTimezone();
    return{
        id: review._id.toString(),
        rating: review.rating ,               
        review: review.review?review.review:"",
        user:{
            id:review.userId._id.toString(),
            name:review.userId.name,
            email:review.userId.email
        } ,               
        reviewableType: review.reviewableType,
        reviewableId: review.reviewableId  ,       
        createdAt: formatInTimeZone(review.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        updatedAt: formatInTimeZone(review.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }
}


export const toReviewResponsePopulatedRevewableIdDTO=(review)=>{
    const timezone = getTimezone();
    return{
        id: review._id.toString(),
        rating: review.rating ,               
        review: review.review?review.review:"",
        user:{
            id:review.userId._id.toString(),
            name:review.userId.name,
            email:review.userId.email
        } ,               
        reviewableType: review.reviewableType,
        sessionId: review.reviewableId._id.toString(),    
        sessionName:review.reviewableId.sessionName,          
        createdAt: formatInTimeZone(review.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
        updatedAt: formatInTimeZone(review.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    }
}