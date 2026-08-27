export const ADMIN_ROUTES = {
  // users routes
  GET_USERS: '/admin/users/allUsers',
  GET_STATS: '/admin/users/getStats',
  TOGGLE_BLOCK: '/admin/users/toggleBlock',
  DELETE_USER: `/admin/users/deleteUser`,
  UPDATE_USER_ROLE: '/admin/users/updateRole',

  //trainers Management
  GET_TRAINERS:'/admin/trainers',
  GET_PENDING_TRAINERS: '/admin/trainers/get_pending_trainers',
  GET_TRAINER: '/admin/trainers/get_trainer',
  TRAINERS: '/admin/trainers',

  //sports Mangement
  ADD_SPORT: '/admin/category/sports/sport',
  GET_SPORTS: '/admin/category/sports',
  UPDATE_SPORT: '/admin/category/sports/',
  TOGGLE_SPORT_STATUS: '/admin/category/sports/status',
  DELETE_SPORT: '/admin/category/sports',

  // FITNESS Management
  ADD_PROGRAM: '/admin/category/fitness/program',
  GET_PROGRAMS: '/admin/category/fitness',
  TOGGLE_PROGRAM_STATUS: '/admin/category/fitness/program-status',
  UPDATE_PROGRAM: '/admin/category/fitness/program/',
  DELETE_PROGRAM: '/admin/category/fitness/program',

  // Session Management
  GET_SESSION_STATS: '/admin/sessions/getStats',
  GET_SESSIONS: '/admin/sessions',
  APPROVE_SESSION: {
    BY_MODEL_ID: (id: string, sessionModel: string) =>
      `/admin/sessions/${sessionModel}/${id}/approve`,
  },
  ACTIVATE_SESSION: {
    BY_MODEL_ID: (id: string, sessionModel: string) =>
      `/admin/sessions/${sessionModel}/${id}/activate`,
  },
   GET_SESSION: {
    BY_ID: (id: string, sessionModel: string) =>
      `/admin/sessions/${sessionModel}/${id}`,
  },





  //  Booking Management
   GET_BOOKINGS_STATS:'/admin/bookings/stats',
   GET_BOOKINGS:'/admin/bookings',
   GET_BOOKING:{
    BY_ID:(id:string)=>`/admin/bookings/${id}`
   },
 


   GET_PAYMENT_STATS:'/admin/payments/stats',
   GET_PAYMENTS:'/admin/payments',

   SETTINGS:'/admin/settings/'

} as const;

