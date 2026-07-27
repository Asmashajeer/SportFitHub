import { Review_Type } from "@/constants/enums";
import { ReviewRequestDTO, SessionReviewPromptRequestDTO } from "@/dtos/request/review/review.request.dto";
import { PendingReviewResponseDTO, RatingAggregateResult, ReviewResponseDTO, ReviewResponsePopulatedUserDTO } from "@/dtos/response/review/review.response.dto";
import { IReview } from "@/models/review.model";

export interface IReviewService{
    
    topReviews(reviewableType: Review_Type):Promise<RatingAggregateResult[]>
    sendReviewPromptforSession(prompt:SessionReviewPromptRequestDTO):Promise<void>
    getPendingReviewsForUser(userId: string):Promise<PendingReviewResponseDTO[]>
    getReviewableSession(userId: string, sessionId: string)
    createReview(data: ReviewRequestDTO):Promise<ReviewResponseDTO>
    getAvgRatingAndCount(reviewableType: Review_Type ,reviewableId:string):Promise<{ averageRating: number; totalReviews: number }>,
     getReviews(reviewableType: Review_Type ,reviewableId:string):Promise<ReviewResponsePopulatedUserDTO[]>
}