import { Review_Type } from "@/constants/enums";
import { IRatingAggregateResult } from "@/dtos/response/review/review.response.dto";
import { IBaseRepository } from "./IBase.repository";
import { IReview } from "@/models/review.model";
import { FilterQuery, Types } from "mongoose";

export interface IReviewRepository extends IBaseRepository<IReview> {
    TopReviews(reviewableType:Review_Type):Promise<IRatingAggregateResult[]>
    findReviewedSessionIds(query:FilterQuery<IReview>)
    getAverageRatingAndCount(reviewableType: Review_Type ,reviewableId:string)
    getReviews(reviewableType: Review_Type ,reviewableId:string|Types.ObjectId)
}