export const MESSAGES={    

  //messages  
  success:{ 
    OTP_SENT: 'OTP sent to email. Please verify within 5 minutes.',
    OTP_RESENT: 'New OTP sent to your email.',    
    REGISTER_SUCCESS: 'Registration successful. Please verify your email.',
    LOGIN_SUCCESS: 'Logged in successfully.',
    USER_BLOCKED: 'User is blocked',
    USER_DELETED:'Useedeleted ',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    VERIFICATION_CODE_SENT: 'Verification code  sent to your email.',    
    PASSWORD_UPDATED: 'Password updated successfully.',
    ROLE_UPDATED:'Role updated',   
    EMAIL_VERIFIED:'Email verified successfully',

    //profile messages
    PROFILE_CREATED:'Profile created successfully',
  },
  // error messages
  error:{
    USER_EXISTS: 'User already exists',
    BLOCKED_USER:"User blocked by admin",
    INVALID_CREDENTIALS: "Invalid credentials ",
    OTP_INVALID: 'Invalid or expired OTP.',
    SEND_VERIFICATION_CODE_FAILED:'Failed to send verification code. Please try again later',
    REFRESH_TOKEN_MISSING: 'Refresh token not found',
    REFRESH_TOKEN_INVALID: 'Invalid token',
    USER_NOT_FOUND: 'User not found',   
    GOOGLE_EMAIL_MISSING: 'No email provided by Google',
    STATS_ERROR:"Cannot fetch stats details",

    //profile
    PROFILE_EXISTS: 'Profile for this user already exists',

  },
  trainer:{
    success:{
      TRAINER_FETCH_SUCCESS:"Trainer details fetched successfully",
      TRAINER_DOC_STATUS_UPDATED:"Trainer Documents status updated"
    },
    error:{
      TRAINER_NOT_FOUND:"trainer not found",
    }
  }
};

export const STATUS_CODE={

  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED : 202,
  NO_CONTENT : 204,

  // Client Errors
  BAD_REQUEST : 400,
  UNAUTHORIZED : 401,
  FORBIDDEN : 403,
  NOT_FOUND : 404,
  METHOD_NOT_ALLOWED : 405,
  CONFLICT : 409,

  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
};


