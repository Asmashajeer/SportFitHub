import type {
  AGE_GROUP,
  DayName,
  PAYLOAD_MODEL,
  SESSION_TYPE,
} from '@/constants/constants';
interface SportsCategory {
  id: string;
  sportName: string;
  icon: string;
  slug: string;
}

export interface Venue {
  name: string;
  address: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}
export interface ISlots {
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  _id?: string;
}
export interface TimeSlot {
  _id?: string;
  day: DayName;
  slots: ISlots[];
}

export interface Pricing {
  _id?: string;
  sessionCount: number;
  price: number;
}



export interface SportsSessionResponseData {
  id: string;
  trainerId: string;
  timezone:string;
  sportCategory: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: (typeof AGE_GROUP)[keyof typeof AGE_GROUP];
  sessionType: (typeof SESSION_TYPE)[keyof typeof SESSION_TYPE];
  maxCapacity: number;
  enrolledCount: number; 
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
  updatedAt?: Date;
}

export interface SportsSessionImage {
  publicId: string;
  url: string;
}
export interface SportSessionFormResponseDTO extends Omit<SportsSessionResponseData, 'images'> {
  images: SportsSessionImage[];
}
export interface SportsSessionPublicResponseData extends Omit<
  SportsSessionResponseData,
  'sportCategory'
> {
  sportCategory: SportsCategory;
}

interface PopulatedTrainer {
  id: string;
  userId:string;
  displayName: string;
  profilePic: string;
  coreDiscipline: string;
  specialties: string[];
  experience: number;
  languages: string[];
  averageRating: number;
}
export interface SportsSessionDetailedPublicResponseData extends Omit<
  SportsSessionResponseData,
  'sportCategory' | 'trainerId'
> {
  sportCategory: SportsCategory;
  trainer: PopulatedTrainer;
}

export interface PaginationResponseData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PricePlan {
  _id?: string;
  sessionCount: number;
  price: number;
}

export interface BasePayload {
  sessionId: string;
  planId: string;
  numberOfSessions: number;
  amount: number;
  type: string;
}
export interface IPayload extends BasePayload {
  date: string;
  slotId: string;
  slotTime: string;
}

export interface session_filter {
  id: string;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
}



