import type {  ReviewType } from "@/constants/constants";

export const REVIEW_ROUTE={
    PENDING_REVIEWS:'/review/pending',
    GET_SESSION:(sessionId:string)=>`/review/session/${sessionId}`,
    SUBMIT_REVIEW:(sessionModel:ReviewType,sessionId:string)=>`/review/${sessionModel}/${sessionId}`,
    GET_AVG_RATING_REVIEW_COUNT:(sessionModel:ReviewType,sessionId:string)=>`/review/rating/${sessionModel}/${sessionId}`,
    GET_BATCH_RATING_REVIEW_COUNT:(sessionModel:ReviewType)=>`/review/batch_rating/${sessionModel}`,

    GET_REVIEWS:(sessionModel:ReviewType,sessionId:string)=>`/review/${sessionModel}/${sessionId}`,
    GET_ALL_REVIEWS:'review/allReviews',
}