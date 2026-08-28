import api from "@/api/axiosInstance";
import { REVIEW_ROUTE } from "./review.api";

import type {  SessionReviewData } from "../types/review.schema";
import type { ReviewType } from "@/constants/constants";

export const reviewService={
    getPendingReviews:async()=>{
        const res= await api.get(REVIEW_ROUTE.PENDING_REVIEWS);
        return res.data;
    },
    getSessionForReview:async(sessionId:string)=>{
        const res= await api.get(REVIEW_ROUTE.GET_SESSION(sessionId));
        return res.data;
    },
    submitReview:async(data:SessionReviewData)=>{
         const res= await api.post(REVIEW_ROUTE.SUBMIT_REVIEW(data.sessionModel,data.sessionId),data);
        return res.data;
    },
    getAvgRatingAndCount:async(sessionId:string,sessionModel:ReviewType)=>{
          const res= await api.get(REVIEW_ROUTE.GET_AVG_RATING_REVIEW_COUNT(sessionModel,sessionId));
        return res.data;
    },
     getBatchRatings:async(sessionIds:string[],sessionModel:ReviewType)=>{
        
        const res= await api.get(REVIEW_ROUTE.GET_BATCH_RATING_REVIEW_COUNT(sessionModel),{params:{sessionIds},
          paramsSerializer: { indexes: null }
        })
        return res.data;
    },
    getReviews:async(sessionId:string,sessionModel:ReviewType)=>{
          const res= await api.get(REVIEW_ROUTE.GET_REVIEWS(sessionModel,sessionId));
        return res.data;
    },
    getReviewsByTrainer:async(trainerId:string)=>{
        const res= await api.get(REVIEW_ROUTE.GET_ALL_REVIEWS,{params:{trainerId}});
        return res.data;
    }
}