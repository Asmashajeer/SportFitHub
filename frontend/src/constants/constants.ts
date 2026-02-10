import { CalendarDays, CircleUser, LayoutDashboard, MessageCircle, MessageSquare, MessageSquareDiff, Ticket, UserCheck, Wallet, Wallet2 } from "lucide-react";

export const ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  USER: 'user',
} as const; 
export type UserRole = typeof ROLES[keyof typeof ROLES];

export const OTP_EXPIRATION_MINUTES = 5; 

export const OTP_TYPE={
  VERIFICATION : 'VERIFICATION',
  PASSWORD_RESET : 'PASSWORD_RESET',
}

export const LIMIT=5;

export const GENDER= {
   MALE : 'Male',
  FEMALE : 'Female',
  OTHER : 'Other'
}
export type GenderType= typeof GENDER[keyof typeof GENDER]



export const RELATIONSHIP = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  OTHER: 'Other'
};
export type RelationType = typeof RELATIONSHIP[keyof typeof RELATIONSHIP];

export const TRAINER_CATEGORY={
  SPORT:'Sports',
  FITNESS:'Fitness'
}
export type categoryType=typeof TRAINER_CATEGORY[keyof typeof TRAINER_CATEGORY]

export const GOVT_ID_TYPE={
  AADHAR : 'Aadhar',
  PASSPORT : 'Passport',
  DRIVING_LICENSE : 'Driving License',
  PAN : 'PAN'
}

export const DOC_VERIFY_STATUS= {
  PENDING : 'pending',
  VERIFIED: 'verified',
  REJECTED : 'rejected',
}
export type Doc_status_type=typeof DOC_VERIFY_STATUS [keyof typeof DOC_VERIFY_STATUS]

export const CURRENCY={
  US : 'US $' ,
EURO:	'EUR	€'	,
BRITISH_POUND:	'GBP	£(British Pound)'	,
INR:'	INR	₹'	,
UAE_DIRHAM:	'AED(UAE)',
}

export const TRAINER_STATUS= {
  SUBMITTED : 'submitted',
  UNDER_REVIEW : 'under review',
  APPROVED : 'approved',
  REJECTED : 'rejected',
  SUSPENDED : 'suspended'
}


export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type DayName = typeof DAYS_OF_WEEK[number];
export const userNavLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard',},
  { label: 'Calender', icon: CalendarDays, path: '/user/calender' },
  { label: 'Enrollments ', icon: Ticket, path: '/user/enrolment' },
  { label: 'Payments', icon:Wallet , path: '/user/payments' },
  { label: 'Messages', icon: MessageSquare, path: '/user/messages' },
  { label: 'Profile', icon: CircleUser, path: '/user/profile' },
];

export const trainerNavLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/trainer/dashboard' },
  { label: 'Schedule', icon:CalendarDays, path: '/traner/schedule' },
  { label: 'Mark Attendance ', icon:UserCheck, path: '/trainer/mark-attendace' },
  { label: 'Earnings', icon:Wallet2 , path: '/camps' },
  { label: 'Communication', icon: MessageCircle, path: '/trainer/communication' },
  { label: 'feedback Rating', icon: MessageSquareDiff, path: '/trainer/feedback-rating' },
  { label: 'Profile', icon: CircleUser, path: 'trainer/profile' },

];