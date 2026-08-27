export const TRAINER_ROUTES = {
  //------------profile------------
  ADD_PROFILE: '/trainer/add-profile',
  GET_PROFILE_PIC: '/trainer/profile_pic',
  GET_PROFILE: '/trainer/profile',
  // UPDATE_PROFILE:'/trainer/profile',
  UPDATE_PROFILE: {
    BY_ID: (profileId: string) => `trainer/profile/${profileId}`,
  },
  UPDATE_PROFILE_PIC: {
      BY_ID: (profileId: string) => `trainer/profile/profile_pic/${profileId}`,
    },


      //------------Booking------------
  GET_BOOKINGS: '/trainer/bookings',
  GET_BOOKED_SESSIONS:'/trainer/bookings/booked-sessions',
 
}

//-------SPRORTS SESSION--------------
export const SPORTS_SESSION_ROUTE = {
  ADD_SPORT_SESSION: '/trainer/sessions/sports/sport',
  SPORT_SESSION: {
    BY_ID: (id: string) => `/trainer/sessions/sports/sport/${id}`,
  },
  SPORT_SESSION_TO_UPDATE:{
    BY_ID: (id: string) => `/trainer/sessions/sports/sport/${id}/update`,
  },
  GET_SESSIONS: '/trainer/sessions/sports',
};


//----------FITNESS SESSION------------
export const FITNESS_SESSION_ROUTE = {
  ADD_FITNESS_SESSION: '/trainer/sessions/fitness/fitnessSession',
  FITNESS_SESSION: {
    BY_ID: (id: string) => `/trainer/sessions/fitness/fitnessSession/${id}`,
  },
  GET_SESSIONS: '/trainer/sessions/fitness',
};

export const DOCUMENTS_ROUTE={
  GET_CERTIFICATE:`/documents/download?type=certificate`,
  GET_ID_ATTACHMENT:`/documents/download?type=id-attachment`,
}






//--------------ATTENDANCE---
export const TRAINER_ATTENDACE_ROUTE={
   GET_BOOKED_SESSIONS_OCCURANCES:'/trainer/attendance/booked-sessions-occurances',
   MARK_ATTENDANCE:(sessionId:string)=>`/trainer/attendance/${sessionId}/mark-attendance`
}

//-----EARNINGS------------
export const TRAINER_EARNINGS_ROUTE={
   GET_SUMMARY:'/trainer/earnings/summary',
   GET_HISTORY:'/trainer/earnings/history',
   GET_SESSIONS:'/trainer/earnings/sessions',  
   GET_STRIPE_STATUS:'/trainer/earnings/stripe_status', 
   STRIPE_CONNECT: '/trainer/earnings/stripe_connect', 
   GENERATE_LINK: '/trainer/earnings/stripe_refresh-link', 
  
}