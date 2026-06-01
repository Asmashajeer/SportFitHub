import type { AGE_GROUP, DayName, GenderType, Intensity_level_type, Session_Mode_type, SESSION_TYPE } from "@/constants/constants";
interface Venue {
  name: string;
  address: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface TimeSlot {
  _id?: string;
  day: DayName;
  slots: {
    startTime: string; // "09:00"
    endTime: string; // "10:00"
    _id?: string;
  }[];
}

interface Pricing {
  _id?: string;
  sessionCount: number;
  price: number;
}

export interface TrainerDetails{
   id: string;
   displayName: string;
   profilePic: string;
   coreDiscipline: string;
   specialties: string[];
   experience: number;
   languages: string[];
   averageRating: number;
  isIdVerified:boolean,
  isCertificateVerified:boolean,
  joinedAt:string
}
export interface SportsSessionDetailsData {
  id: string;
  trainerId: string;
  sportCategory: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: (typeof AGE_GROUP)[keyof typeof AGE_GROUP];
  sessionType: (typeof SESSION_TYPE)[keyof typeof SESSION_TYPE];
  maxCapacity: number;
  enrolledCount: number;
  mode: Session_Mode_type;
  venue: Venue;
  amenities: string[];
  timeSlots: TimeSlot[];
  pricing: Pricing[];
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
  isActive?: boolean;
  isDeleted?: boolean;
  isApproved?: boolean;
  images: string[];
  rating?: number;
  updatedAt?:string;
  createdAt?:string
}

export interface AdminSportSessionDetails extends Omit<SportsSessionDetailsData ,'trainerId'>{
  trainer:TrainerDetails
}
export interface FitnessSessionDetailsData {
  id: string;
  trainerId: string;
  fitnessCategory: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: (typeof AGE_GROUP)[keyof typeof AGE_GROUP];
  gender: GenderType;
  sessionType: (typeof SESSION_TYPE)[keyof typeof SESSION_TYPE];
  maxCapacity: number;
  enrolledCount: number;
  intensityLevel: Intensity_level_type;
  mode: Session_Mode_type;
  venue: Venue;
  amenities: string[];
  requirements: string[];
  timeSlots: TimeSlot[];
  pricing: Pricing[];
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
  isActive?: boolean;
  isDeleted?: boolean;
  isApproved?: boolean;
  images: string[];
  rating?: number;
  createdAt:string;
  updatedAt?: string;
}

export interface AdminFitnessSessionDetails extends Omit<FitnessSessionDetailsData ,'trainerId'>{
  trainer:TrainerDetails
}
