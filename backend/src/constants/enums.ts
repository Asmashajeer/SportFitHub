export enum UserRole {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  USER = 'user',
  PENDING = 'pending', // This is the "Onboarding" state for google login
}
export type user_role_onRoute = Exclude<UserRole, UserRole.PENDING>;
export enum OtpType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export const PAGINATION_LIMIT=10;


export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  ALL='All'
}
export enum RELATIONSHIP {
  SELF = 'Self',
  SPOUSE = 'Spouse',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  OTHER = 'Other',
}



//Trainer
export enum TRAINER_CATEGORY {
  SPORT = 'Sports',
  FITNESS = 'Fitness',
}
export enum GOVT_ID_TYPE {
  AADHAR = 'Aadhar',
  PASSPORT = 'Passport',
  DRIVING_LICENSE = 'Driving License',
  PAN = 'PAN',
}

export enum DOC_VERIFY_STATUS {
  PENDING = 'pending',
  VERIFIED= 'verified',
  REJECTED = 'rejected',
}

export enum TRAINER_STATUS {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export const CURRENCIES = {
  US: '$',
  EURO: '€',
  BRITISH_POUND: '£',
  INR: '₹',
  UAE_DIRHAM: 'AED',
};
export const CURRENCY='₹';

// session
export enum AGE_GROUP{
  KIDS='Kids',
  TEENS= 'Teens',
  ADULTS= 'Adults',
  SENIORS= 'Seniors', 
  ALL='All',
}

export enum SESSION_TYPE{
  ONE_ONE='one-to-one',
  GROUP= 'group',
}
export enum DAY {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
}

export enum SESSION_MODE{
  ONLINE='Online',
  OFFLINE="Offline"
}


export enum INTENSITY_LEVEL {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  
}

export enum  PAYLOAD_MODEL{
    SPORT_SESSION='SportsSession',
    FITNESS_SESSION='FitnessSession'
}

export enum BOOKING_TYPE{
  SINGLE='single',
  MULTIPLE='multiple'
}
export enum PAYMENT_METHOD{
  CARD='card',
  WALLET= 'wallet'
}
export enum PAYMENT_STATUS{
  SUCCESS='succeeded',
  REFUND= 'refunded', FAILED= 'failed' ,ACTION_REQUIRED= 'requires_action'
}

export enum DISCOUNT_TYPE{
  PERCENTAGE='percentage' ,
  FIXED= 'fixed'
}

export enum BOOKING_STATUS{
  PENDING='pending',
  CONFIRMED= 'confirmed', 
  COMPLETED='completed',
  CANCELLED= 'cancelled'
}
export enum BOOKING_SESSION_STATUS{
  SCHEDULED='scheduled',
 RESCHEDULED= 'rescheduled', 
  COMPLETED='completed',
  CANCELLED= 'cancelled'
}
export const TTLSECONDS=900;

export enum TRANSACTION_TYPE{
  DEBIT='Debit',
  CREDIT='Credit'
}
export enum TRANSACTION_REASON{
 REFUND= "Refund" ,
 CANCELLATION_FUND ="Cancellation Refund" ,
 TOP_UP= "Top Up" ,
 ADMIN_CREDIT= "Admin Credit" ,
  BOOKING_PAYMENT="Booking Payment"
}
export enum TRANSACTION_STATUS {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export const PENALTY = {
  CANCELLATION_PENALTY_PERCENT: 15,   // 15% of session revenue deducted from trainer wallet
  
  STRIKE_THRESHOLDS: {
    WARNING: 1,       // 1st strike → warning email only
    PENALTY: 2,       // 2nd strike → financial deduction
    SUSPENSION: 3,    // 3rd strike → account suspended
  },

  STRIKE_RESET_DAYS: 90,   // strikes reset after 90 days 
} as const;