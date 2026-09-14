import type {  ReviewType } from "@/constants/constants";

export const REVIEW_ROUTE={
    PENDING_REVIEWS:'/review/pending',
    GET_SESSION:(sessionId:string)=>`/review/session/${sessionId}`,
    SUBMIT_REVIEW:(sessionModel:ReviewType,sessionId:string)=>`/review/${sessionModel}/${sessionId}`,
    

  
    GET_ALL_REVIEWS:'review/allReviews',
}