import { IReview } from "@/models/review.model";
import { BaseRepository } from "./base.repository";
;
import { Review_Type } from "@/constants/enums";
import { IRatingAggregateResult } from "@/dtos/response/review/review.response.dto";
import { IReviewRepository } from "@/interfaces/repositories/IReview.repository";
import { Types, Model } from "mongoose";


export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor(model: Model<IReview>) {
    super(model);
  }
  async TopReviews(reviewableType: Review_Type):Promise<IRatingAggregateResult[]>{
       return await this.model.aggregate([
            {$match:{reviewableType}},
            {$group:{_id:"$reviewableId",avgRating:{$avg:'$rating'},count:{$sum:1}}},
            {$sort:{avgRating:-1}},
            {$limit:10}

        ])
  }


  async findReviewedSessionIds(query:{userId:string,reviewableIds:string[]}){
    const {userId,reviewableIds}=query;
    return await this.model.find({ userId, reviewableId: { $in: reviewableIds } })
   
  }

  async getAverageRatingAndCount(reviewableType: Review_Type ,reviewableId:string|Types.ObjectId){
     return await this.model.aggregate( [
        { $match: {  
          reviewableId: new Types.ObjectId(reviewableId),
          reviewableType, },
        },
        {
          $group: {
            _id: '$reviewableId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]);
  }



   async getReviews(reviewableType: Review_Type ,reviewableId:string|Types.ObjectId){
        return await this.model.find({reviewableId,reviewableType})
        .populate('userId','_id name email ');
   }
   async getAllReviews(sessionIds:string[]){
      return await this.model.find({ reviewableId: { $in: sessionIds } })
        .populate('reviewableId', '_id sessionName')
        .populate('userId', '_id name email')
        .sort({ createdAt: -1 });        
   }


}