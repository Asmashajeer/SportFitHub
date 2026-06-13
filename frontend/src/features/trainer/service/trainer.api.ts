export const TRAINER_ROUTES = {
  //------------profile------------
  ADD_PROFILE: '/trainer/add-profile',
  GET_PROFILE_PIC: '/trainer/profile_pic',
  GET_PROFILE: '/trainer/profile',
  // UPDATE_PROFILE:'/trainer/profile',
  UPDATE_PROFILE: {
    BY_ID: (profileId: string) => `trainer/profile/${profileId}`,
  },

  //------------Booking------------
  GET_BOOKINGS: '/trainer/bookings',
  GET_BOOKED_SESSIONS:'/trainer/bookings/booked-sessions',
}
  
export const SPORTS_SESSION_ROUTE = {
  ADD_SPORT_SESSION: '/trainer/sessions/sports/sport',
  SPORT_SESSION: {
    BY_ID: (id: string) => `/trainer/sessions/sports/sport/${id}`,
  },

  GET_SESSIONS: '/trainer/sessions/sports',
};

export const FITNESS_SESSION_ROUTE = {
  ADD_FITNESS_SESSION: '/trainer/sessions/fitness/fitnessSession',
  FITNESS_SESSION: {
    BY_ID: (id: string) => `/trainer/sessions/fitness/fitnessSession/${id}`,
  },
  GET_SESSIONS: '/trainer/sessions/fitness',
};

