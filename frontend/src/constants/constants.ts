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
export const GENDER_TYPES={
  MALE:'Male',
  FEMALE:'Female',
  OTHER:'Other'
}
export type GenderType= typeof GENDER_TYPES[keyof typeof GENDER_TYPES]

export const RELATIONSHIP_TYPES = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  OTHER: 'Other'
};
export type RelationType = typeof RELATIONSHIP_TYPES[keyof typeof RELATIONSHIP_TYPES];


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