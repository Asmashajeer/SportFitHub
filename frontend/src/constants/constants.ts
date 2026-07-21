import {
  CalendarDays,
  CheckCircle,
  CircleUser,
  Layers,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  MessageSquareDiff,
  Settings,
  ShieldCheck,
  Ticket,
  UserCheck,
  Users,
  Wallet,
  Wallet2,
} from 'lucide-react';


export const AppName="SportFitHub"
export const AppEmail="sportfit.hub@gmail.com"

export const ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  USER: 'user',
} as const;

export const USER_ROLES = {
  TRAINER: ROLES.TRAINER,
  USER: ROLES.USER,
} as const;
 
export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const OTP_EXPIRATION_MINUTES = 1;

export const OTP_TYPE = {
  VERIFICATION: 'VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
};

export const PAGINATION_DEFAULT_LIMIT = 10;
export const LOCATION_RADIUS=[2,5.8,10,20,50,100]


export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
  ALL: 'All',
};
export type GenderType = (typeof GENDER)[keyof typeof GENDER];

export const CURRENCY='₹';

export const RELATIONSHIP = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  OTHER: 'Other',
};
export type RelationType = (typeof RELATIONSHIP)[keyof typeof RELATIONSHIP];

export const TRAINER_CATEGORY = {
  SPORT: 'Sports',
  FITNESS: 'Fitness',
};
export type categoryType =
  (typeof TRAINER_CATEGORY)[keyof typeof TRAINER_CATEGORY];


  export  const SPECIALTY_SUGGESTIONS = [
  "Yoga", "Pilates", "CrossFit", "Zumba", "Boxing",
  "Meditation", "Nutrition", "Weight Loss", "Muscle Building",
  "Cardio", "HIIT", "Stretching", "Rehabilitation", "Swimming"
];
export const GOVT_ID_TYPE = {
  AADHAR: 'Aadhar',
  PASSPORT: 'Passport',
  DRIVING_LICENSE: 'Driving License',
  PAN: 'PAN',
};
export type Govt_Id_type = (typeof GOVT_ID_TYPE)[keyof typeof GOVT_ID_TYPE];
export const DOC_VERIFY_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};
export type Doc_status_type =
  (typeof DOC_VERIFY_STATUS)[keyof typeof DOC_VERIFY_STATUS];

export const CURRENCIES = {
  US: '$',
  EURO: '€',
  BRITISH_POUND: '£',
  INR: '₹',
  UAE_DIRHAM: 'AED',
};

export const TRAINER_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  VARIFICATION_REQUIRED: 'Need Verification'
};
export type Trainer_status_type =
  (typeof TRAINER_STATUS)[keyof typeof TRAINER_STATUS];

export const UPLOAD_TYPE = {
  PROFILE_PIC: 'profile_pic',
  ID_ATTACHMENT: 'id_attachment',
  CERTIFICATES: 'certificates',
};

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export type DayName = (typeof DAYS_OF_WEEK)[number];
export const  adminNavLinks= [
    {path:"/admin/dashboard"         , icon:LayoutDashboard ,label:"Dashboard"  },
    {path:"/admin/category-management", icon: Layers ,         label:"Categories"  },
    {path:"/admin/user-management"   , icon: Users ,          label:"Users"      },
    {path:"/admin/trainer-management", icon: ShieldCheck ,    label:"Trainers"   },
    {path:"/admin/session-management", icon: Ticket ,         label:"Sessions"   },
    {path:"/admin/bookings-management"   , icon: CalendarDays ,   label:"Bookings"       },
    {path:"/admin/payment-management"   , icon: CalendarDays ,   label:"Payments"       },      
    {path:"/admin/camp-management"   , icon:CalendarDays ,   label:"Camps"       },
    {path:"/admin/coupons"           , icon:Ticket ,         label:"Coupons"     },
    {path:"/admin/settings"          , icon: Settings ,       label:"Settings"   },
]  
export const userNavLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard' },
  { label: 'My Sessions', icon: CalendarDays, path: '/user/my-sessions' },
  { label: 'My Bookings ', icon: Ticket, path: '/user/my-bookings' },
  { label: 'Payments', icon: Wallet, path: '/user/my-payments' },
  { label: 'Wallet', icon: Wallet, path: '/user/my-wallet' },
  { label: 'Messages', icon: MessageSquare, path: '/user/messages' },
  { label: 'Profile', icon: CircleUser, path: '/user/profile' },
];

export const trainerNavLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/trainer/dashboard' },
  { label: 'Sessions', icon: CalendarDays, path: '/trainer/sessions' },
  { label: 'Bookings ', icon: UserCheck, path: '/trainer/bookings' },
  { label: 'Attandance', icon: CheckCircle, path: '/trainer/attendance' },
  { label: 'Earnings', icon: Wallet2, path: '/camps' },
  {
    label: 'Messages',
    icon: MessageCircle,
    path: '/trainer/messages',
  },
  {
    label: 'feedback Rating',
    icon: MessageSquareDiff,
    path: '/trainer/feedback-rating',
  },
  { label: 'Profile', icon: CircleUser, path: 'trainer/profile' },
];



export const AGE_GROUP = {
  KIDS: 'Kids',
  TEENS: 'Teens',
  ADULTS: 'Adults',
  SENIORS: 'Seniors',
  ALL: 'All',
};

export const SESSION_TYPE = {
  ONE_ONE: 'one-to-one',
  GROUP: 'group',
};

export const TIME_PERIOD = {
  30: '30 Minutes',
  45: '45 minutes',
  60: '1.Hour',
  90: '1.5 Hours',
  120: '2 Hours',
};

export const SESSION_MODE = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
};
export type Session_Mode_type =
  (typeof SESSION_MODE)[keyof typeof SESSION_MODE];

export const INTENSITY_LEVEL = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};
export type Intensity_level_type =
  (typeof INTENSITY_LEVEL)[keyof typeof INTENSITY_LEVEL];

  
export const PAYLOAD_MODEL = {
  SPORT_SESSION: 'SportsSession',
  FITNESS_SESSION: 'FitnessSession',
};

export const BOOKING_TYPE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
};
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BOOKING_SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  RESCHEDULED: 'rescheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};
export const PAYMENT_STATUS = {
  SUCCESS: 'succeeded',
  REFUND: 'refunded',
  FAILED: 'failed',
  ACTION_REQUIRED: 'requires_action',
};
export const TRANSACTION_TYPE = {
  DEBIT: 'Debit',
  CREDIT: 'Credit',
};
export const TRANSACTION_REASON = {
  REFUND: 'Refund',
  CANCELLATION_FUND: 'Cancellation Refund',
  TOP_UP: 'Top Up',
  ADMIN_CREDIT: 'Admin Credit',
  BOOKING_PAYMENT: 'Booking Payment',
};
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};


 export const DISCIPLINE_SPECIALTIES: Record<string, string[]> = {
  football: ['Dribbling', 'Passing', 'Shooting', 'Defending', 'Goalkeeping', 'Fitness'],
  basketball: ['Shooting', 'Dribbling', 'Defense', 'Rebounding', 'Playmaking'],
  yoga: ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin Yoga', 'Pranayama', 'Meditation'],
  fitness: ['Weight Loss', 'Muscle Building', 'HIIT', 'Cardio', 'Strength Training'],
  swimming: ['Freestyle', 'Butterfly', 'Backstroke', 'Breaststroke', 'Endurance'],
  badminton:['Footwork & Movement','Smash Technique','Net Play & Drop Shots','Doubles Strategy','Singles Strategy','Serve & Return Mastery','Deception & Shot Disguise']
};

export const COMMON_LANGUAGES = [
   'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Kannada',
 'Urdu', 'Arabic',  'French', 'Spanish', 'German',  'Japanese', 'Korean'
];


export const ATTENDANCE_STATUS={
  PRESENT:true,
  ABSENT:false
} as const