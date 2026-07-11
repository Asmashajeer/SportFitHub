export const AUTH_ROUTES = {
  // Authentication routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GOOGLE_LOGIN: '/auth/google-login',
  GET_ME: '/auth/authMe',

  // OTP routes
  VERIFY_EMAIL: '/auth/verifyEmail',
  RESEND_OTP: '/auth/resendOtp',

  // Password management
  FORGOT_PASSWORD: '/auth/forgotPassword',
  RESET_PASSWORD: '/auth/resetPassword',

  //  roles

  // SET_ROLE: '/auth/updateRole',
  SET_ROLE:'/auth/setActiveRole'
} as const;
