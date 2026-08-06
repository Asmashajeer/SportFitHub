import { Review_Type } from '@/constants/enums';
import { STATUS_CODE } from '@/constants/messages';
import { IReviewService } from '@/interfaces/services/review/IReview.service';

import { AuthRequest } from '@/middleware/auth.middleware';
import { NextFunction, Response } from 'express';

export class ReviewController {
    private _reviewService: IReviewService;
    constructor(reviewService: IReviewService) {
        this._reviewService = reviewService;
    }



   //------------------------------get pending review of a participant -----
     getPendingReviews=async(req: AuthRequest, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const userId = req.user.id;
            const pending = await this._reviewService.getPendingReviewsForUser(userId);
            res.status(STATUS_CODE.SUCCESS.OK).json(pending);
        } catch (error) {
            next(error);
        }
    }


    // ---------------- fetch session to submit review
    getSessionForReview=async(req: AuthRequest, res: Response, next: NextFunction):Promise<void>=> {
        
            const userId = req.user.id;
            const { sessionId} = req.params;

        try {
            const session = await this._reviewService.getReviewableSession(userId, sessionId);
            res.status(STATUS_CODE.SUCCESS.OK).json(session);
        } catch (error) {
            next(error);
        }
    }

    // ----------  create a review
    submitReview=async (req: AuthRequest, res: Response, next: NextFunction):Promise<void>=> {
        const userId = req.user.id;
        const { sessionId, sessionModel, rating, review } = req.body;

        try {
            const userReview = await this._reviewService.createReview({
            userId,
            reviewableType: sessionModel as Review_Type,
            reviewableId:sessionId, 
            rating,
            review:review ? review:"",
            });
            res.status(STATUS_CODE.SUCCESS.CREATED).json(userReview);
        } catch (error) {
            next(error);
        }
    }


    //------------------------get average Rating & Review Count
    getAvgRatingAndReviewCount=async (req: AuthRequest, res: Response, next: NextFunction):Promise<void>=>{
      
        const sessionModel =req.params.sessionModel as Review_Type
        const sessionId=req.params.sessionId as string;
         try {
            const result= await this._reviewService.getAvgRatingAndCount( sessionModel ,sessionId);           
            console.log("res  :",result);
            res.status(STATUS_CODE.SUCCESS.OK).json(result);
        } catch (error) {
            next(error);
        }
    }


    //----------------------All Reviews of a sessoin
   getReviews=async (req: AuthRequest, res: Response, next: NextFunction):Promise<void>=>{
        
            const sessionModel =req.params.sessionModel as Review_Type
            const sessionId=req.params.sessionId as string;
            try {
                const reviews= await this._reviewService.getReviews( sessionModel ,sessionId);           
                console.log("reviews  :",reviews);
                res.status(STATUS_CODE.SUCCESS.OK).json(reviews);
            } catch (error) {
                next(error);
            }
        }


      //--------------------get top reviws of a category  
    TopReviews= async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {       
        const reviewable_type =req.query.reviewable_type as Review_Type;
        
        try {
            const reviews = await this._reviewService.topReviews(reviewable_type);
            res.status(STATUS_CODE.SUCCESS.OK).json(reviews);
        } catch (error) {
            next(error);
        }
    }
    getAllSessionReviewsByTrainer=async(req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {      
        const trainerId=req.query.trainerId as string;
        try{
            const allReviews=await this._reviewService.getAllSessionReviews(trainerId);
             res.status(STATUS_CODE.SUCCESS.OK).json(allReviews);
        } catch (error) {
            next(error);
        }
    }
}