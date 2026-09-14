import type { ReviewType } from "@/constants/constants";

export const PUBLIC_ROUTE = {
  GET_All_SPORTS: '/sportsCategory',
  GET_SPORTS_SESSIONS: '/sports/sessions',
  GET_SPORTS_SESSION: {
    BY_ID: (id: string) => `/sports/sessions/${id}`,
  },
  GET_All_FITNESS: '/fitnessCategory',
  GET_FITNESS_SESSIONS: '/fitness/sessions',
  GET_FITNESS_SESSION: {
    BY_ID: (id: string) => `/fitness/sessions/${id}`,
  },
  GET_BOOKED_SLOTS: {
    BY_SESSIONID: (sessionId: string) => `/availability/${sessionId}`,
  },

  GET_BATCH_RATING_REVIEW_COUNT:(sessionModel:ReviewType)=>`/batch_rating_review/${sessionModel}`,
  GET_AVG_RATING_REVIEW_COUNT:(sessionModel:ReviewType,sessionId:string)=>`/rating/${sessionModel}/${sessionId}`,
  GET_REVIEWS:(sessionModel:ReviewType,sessionId:string)=>`/session_review/${sessionModel}/${sessionId}`,  
};



