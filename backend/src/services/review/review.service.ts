import {  Review_Type } from "@/constants/enums";
import { STATUS_CODE } from "@/constants/messages";
import { ReviewRequestDTO, SessionReviewPromptRequestDTO } from "@/dtos/request/review/review.request.dto";
import { PendingReviewResponseDTO, RatingAggregateResult, ReviewResponseDTO, ReviewResponsePopulatedRevewableIdDTO, ReviewResponsePopulatedUserDTO, SessionResponseForReviewDTO } from "@/dtos/response/review/review.response.dto";
import { IBookingSessionRepository } from "@/interfaces/repositories/IBook.session.repository";
import { IReviewRepository } from "@/interfaces/repositories/IReview.repository";
import { IReviewService } from "@/interfaces/services/review/IReview.service";
import { toPendingReviewResponseDTO, toRatingAggregateResult,toReviewResponseDTO, toReviewResponsePopulatedRevewableIdDTO, toReviewResponsePopulatedUserDTO, toSessionResponseForReviewDTO } from "@/mappers/review.mapper";

import AppError from "@/utils/AppError";
import { sendPushNotification } from "@/utils/push-notification.service";
import { sendNotificationEmail } from "@/utils/sendNotfication.mail";
import { Types } from "mongoose";

import { ISportsSessionRepository } from "@/interfaces/repositories/ISports.session.repository";
import { IFitnessSessionRepository } from "@/interfaces/repositories/IFitness.session.repository";

export class ReviewService implements IReviewService {
  private _reviewRepo: IReviewRepository;
  private _bookingSessionRepo:IBookingSessionRepository
  private _sportsSessionRepo:ISportsSessionRepository
   private _fitnessSessionRepo:IFitnessSessionRepository
  constructor(reviewRepo: IReviewRepository,bookingSessionRepo:IBookingSessionRepository,sportsSessionRepo:ISportsSessionRepository,fitnessSessionRepo:IFitnessSessionRepository) {
    this._reviewRepo = reviewRepo;
    this._bookingSessionRepo=bookingSessionRepo;
    this._sportsSessionRepo=sportsSessionRepo;
    this._fitnessSessionRepo=fitnessSessionRepo
  }





//-----------------email and push notification review prompt for session-----------
  sendReviewPromptforSession=async(prompt:SessionReviewPromptRequestDTO):Promise<void>=>{   
      const existingReview=await this._reviewRepo.findOne({userId:prompt.userId,reviewableType:prompt.sessionModel,reviewableId:prompt.sessionId});
      if(existingReview) return;

      await sendNotificationEmail({
        to:prompt.email,
        title: 'How was your session?',
        description: `Hi ${prompt.name}, you recently attended "${prompt.sessionName}" with ${prompt.trainerName}. We'd love to hear how it went.`,
        details: {
          userName: prompt.name,
          Session: prompt.sessionName,
          Trainer: prompt.trainerName,
        },
        closingLine: `Tap below to leave a quick review — it only takes a minute and helps ${prompt.trainerName} and other members.
                      ${process.env.FRONTEND_URL}/user/review/${prompt.sessionModel}/${prompt.sessionId}' prompt.sessionId} Leave a Review`,

      });      
      await sendPushNotification(prompt.fcmToken,
        {
          title: 'How was your session?',
          body: `You attended "${prompt.sessionName}" with ${prompt.trainerName}. Leave a quick review!`,
          data: {
            type: 'REVIEW_PROMPT',
            sessionName: prompt.sessionName,
            trainerName: prompt.trainerName,
          },
     })
  } 




getPendingReviewsForUser=  async (userId: string):Promise<PendingReviewResponseDTO[]>=> {
      // Sessions this user attended 
      const attendedSessions = await this._bookingSessionRepo.findUserSessions({
        userId,
        attendance: true,
      });
      
      if (attendedSessions.length === 0) return [];

      const attendedSessionIds = attendedSessions.map((s) => s.sessionId._id.toString());
      
      // Sessions they've already reviewed, among the ones they attended
      const reviewedSessionIds = await this._reviewRepo.findReviewedSessionIds( {userId,  reviewableIds:attendedSessionIds } )
   
      const reviewedSet = new Set(reviewedSessionIds.map((r) => r.reviewableId.toString()));
     
      // Diff — attended, not yet reviewed
      const pending = attendedSessions
        .filter((s) => !reviewedSet.has(s.sessionId._id.toString()))
        .map((s) =>toPendingReviewResponseDTO (s));
        

      return pending;
  }


  async getReviewableSession(userId: string, sessionId: string):Promise<SessionResponseForReviewDTO> {
      // 1. Confirm this user actually attended this session
      const attendance=true;
      const attendantedSession = await this._bookingSessionRepo.findOneSession({userId, sessionId,attendance} );
      console.log(attendantedSession);
      if (!attendantedSession) {
        throw new AppError(  'You can only review sessions you attended',STATUS_CODE.ERROR.FORBIDDEN       );
      }

      const existingReview = await this._reviewRepo.findOne({ userId,  reviewableId: sessionId  });
      if (existingReview) {
        throw new AppError(   'You have already reviewed this session',STATUS_CODE.ERROR.CONFLICT        );
      }   
      return toSessionResponseForReviewDTO (attendantedSession);
 
    }



    async createReview(data: ReviewRequestDTO):Promise<ReviewResponseDTO> {
     
      const attendantedSession = await this._bookingSessionRepo.findOne({
        userId: data.userId,
        sessionId: data.reviewableId,
        attendance: true,
      });
      if (!attendantedSession) {
        throw new AppError('You can only review sessions you attended', STATUS_CODE.ERROR.FORBIDDEN);
      }

      const existingReview = await this._reviewRepo.findOne({
        userId: data.userId,
        reviewableId: data.reviewableId,
      });
      if (existingReview) {
        throw new AppError('You have already reviewed this session', STATUS_CODE.ERROR.CONFLICT);
      }

      const userReview = await this._reviewRepo.create({
        userId: new Types.ObjectId(data.userId),        
        reviewableId: new Types.ObjectId(data.reviewableId),
        reviewableType: data.reviewableType, 
        rating: data.rating,
        review: data.review,
      });
      const review=toReviewResponseDTO(userReview);
      // update sessionDetails rating
      const [result]=await this._reviewRepo.getAverageRatingAndCount(review.reviewableType,review.reviewableId);
      console.log(result.averageRating);
      switch(review.reviewableType){
        case Review_Type.SPORT_SESSION:await this._sportsSessionRepo.findOneAndUpdate(review.reviewableId,{rating:result.averageRating});
        break;
        case Review_Type.FITNESS_SESSION:await this._fitnessSessionRepo.findOneAndUpdate(review.reviewableId,{rating:result.averageRating});
        break;
        default:break;
      }
      
      return review;
    }


     getAvgRatingAndCount=async(reviewableType: Review_Type ,reviewableId:string):Promise<{ averageRating: number; totalReviews: number }>=>{
        const [result]=await this._reviewRepo.getAverageRatingAndCount(reviewableType,reviewableId);
       
        return result;
    };
    getBatchRatingAndCount=async(reviewableType: Review_Type ,reviewableIds:string[]):Promise<{ averageRating: number; totalReviews: number }[]>=>{
            const result=await this._reviewRepo.getBatchRatingAndCount(reviewableType,reviewableIds);        
            return result;
        };

     getReviews=async(reviewableType: Review_Type ,reviewableId:string):Promise<ReviewResponsePopulatedUserDTO[]>=>{
        const all=await this._reviewRepo.getReviews(reviewableType,reviewableId);
       
        const reviews=all.map((r)=>toReviewResponsePopulatedUserDTO(r));
        return  reviews;
    };


      //------------------------------top reviews
  topReviews= async(reviewableType:Review_Type):Promise<RatingAggregateResult[]>=>{
   const reviews=await this._reviewRepo.TopReviews(reviewableType);
    return reviews.map((review)=>toRatingAggregateResult(review));
  }



  //------------------get all Session reviews by a trainer
  getAllSessionReviews=async(trainerId:string):Promise<ReviewResponsePopulatedRevewableIdDTO[]>=>{
    const sessions=await  this._bookingSessionRepo.find({trainerId});
    const sessionIds=[...new Set(sessions.map((s)=>(s.sessionId.toString())))];
    const allReviews=await this._reviewRepo.getAllReviews(sessionIds);
    if(!allReviews) throw new Error("no reviews for this trainer.s sessions ")
    console.log(allReviews);
    return await allReviews.map((r)=> toReviewResponsePopulatedRevewableIdDTO(r));
   
  }
}
