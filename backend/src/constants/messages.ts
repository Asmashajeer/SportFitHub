// ------------------------------------SUCCESS---------
export const SUCCESS_MESSAGES = {
  AUTH: {
    // auth & user
    OTP_SENT: 'OTP sent to email. Please verify within 5 minutes.',
    OTP_RESENT: 'New OTP sent to your email.',
    REGISTER_SUCCESS: 'Registration successful. Please verify your email.',
    LOGIN_SUCCESS: 'Logged in successfully.',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    VERIFICATION_CODE_SENT: 'Verification code  sent to your email.',
    PASSWORD_UPDATED: 'Password updated successfully.',
    ROLE_UPDATED: 'Role updated',
    EMAIL_VERIFIED: 'Email verified successfully',
  },
  USER: {
    USER_BLOCKED: 'User is blocked',
    USER_DELETED: 'User deleted ',
    PROFILE_CREATED: 'Profile created successfully',
  },
  SPORT: {
    SPORT_ADDED: 'new Sport added to list',
    SPORT_STATUS_TOGGLE: 'sport status Active : ',
  },
  FITNESS: {
    PROGRAM_ADDED: 'new  fitness program added to list',
    PROGRAM_STATUS_TOGGLE: 'fitness program status Active : ',
  },
  TRAINER: {
    TRAINER_FETCH_SUCCESS: 'Trainer details fetched successfully',
    TRAINER_DOC_STATUS_UPDATED: 'Trainer Documents status updated',
  },
  SESSION:{
    SESSION_CREATED:'New session created',
    SESSION_UPDATED:' session Updated',
    SESSION_DELETED:' session Updated'
  },
  BOOKING:{
    CHECKOUT_SESSION_CREATED:"Checkout session created successfully",
  },
  GENERAL: {
    CREATED:'CREATED sUCCESSFULLY',
    FETCHED: ' Data fetched successfully',
    LOGGED_OUT: 'logged out successfully',
    DELETED: ' deleted successfully',
    UPDATED: 'Updated  successfully',
  },
} as const;

// -------------------ERRORS-----------------------------------
export const ERROR_MESSAGES = {
  AUTH: {
    DB_CONN_ERROR: 'Cant connect with database',
    USER_EXISTS: 'User already exists',
    BLOCKED_USER: 'User blocked by admin',
    INVALID_CREDENTIALS: 'Invalid credentials ',
    OTP_INVALID: 'Invalid or expired code.Please request new one',
    ROLE_INVALID: 'Invalid Role selected',
    SEND_VERIFICATION_CODE_FAILED: 'Failed to send verification code. Please try again later',
    REFRESH_TOKEN_MISSING: 'Refresh token not found',
    REFRESH_TOKEN_INVALID: 'Invalid token',
    USER_NOT_FOUND: 'User not found',
    GOOGLE_EMAIL_MISSING: 'No email provided by Google',
  },
  USER: {
    PROFILE_EXISTS: 'Profile for this user already exists',
    PROFILE_NOT_FOUND: 'Profile for this user NOT exists',
    STATS_ERROR: 'Cannot fetch stats details',
  },
  GENERAL: {
    EXISTED: ' Already exist',
    NOT_FOUND: 'There is no values to fetch',
    UPLOAD_FAILED: ' File upload failed',
    FAILED: 'Internal server Error',
    UPDATE_FAILED: 'updation failed',
  },
  TRAINER: {
    TRAINER_NOT_FOUND: 'trainer not found',
    TRAINER_EXISTS: 'Profile for this TRAINER already exists',
  },
  SESSION: {
        CREATE_FAILED: "We couldn't schedule your  session. Please  try again.",
         UPDATE_FAILED: "We couldn't update your  session. Please  try again.",
        NOT_FOUND:"Session not found"
    },
  BOOKING:{
      NOT_FOUND:"Booking not found"

  }
} as const;

// ---------------------STATUS CODE--------------
export const STATUS_CODE = {
  SUCCESS: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
  },
  ERROR: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;
