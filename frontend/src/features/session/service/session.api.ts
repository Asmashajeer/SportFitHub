export const SPORTS_SESSION_ROUTE = {
  ADD_SPORT_SESSION: '/trainer/sessions/sports/sport',
  UPDATE_SPORT_SESSION: {
    BY_ID: (id: string) => `/trainer/sessions/sports/sport/${id}`,
  },
  GET_SESSIONS: '/trainer/sessions/sports',
};

export const FITNESS_SESSION_ROUTE = {
  ADD_FITNESS_SESSION: '/trainer/sessions/fitness/fitnessSession',
  UPDATE_FITNESS_SESSION: {
    BY_ID: (id: string) => `/trainer/sessions/fitness/fitnessSession/${id}`,
  },
  GET_SESSIONS: '/trainer/sessions/fitness',
};

export const GET_SESSION = {
  BY_ID: (sessionModel: string, id: string) =>
    `/user/sessions/${sessionModel}/${id}`,
};
