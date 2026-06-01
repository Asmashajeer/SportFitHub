import type {
  AGE_GROUP,
  DayName,
  GenderType,
  Intensity_level_type,

  PAYLOAD_MODEL,

  Session_Mode_type,
  SESSION_TYPE,
} from '@/constants/constants';
interface FitnessCategory {
  id: string;
  programName: string;
  slug: string;
  description: string;
}

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
export interface FitnessSessionFormValues {
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
  meetingLink?: string;
  venue?: Venue;
  requirements: string;
  images: FileList | null;
  pricing: Pricing[];
  timeSlots: TimeSlot[];
  amenities: string;
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
}
export interface FitnessSessionData extends Omit<
  FitnessSessionFormValues,
  'images' | 'amenities' | 'requirements'
> {
  trainerId: string;
  images: string[];
  requirements: string[];
  amenities: string[];
}

export interface FitnessSessionResponseData {
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
  updatedAt?: Date;
}

export interface FitnessSessionPublicResponseData extends Omit<
  FitnessSessionResponseData,
  'fitnessCategory'
> {
  fitnessCategory: FitnessCategory;
}

interface PopulatedTrainer {
  id: string;
  displayName: string;
  profilePic: string;
  coreDiscipline: string;
  specialties: string[];
  experience: number;
  languages: string[];
  averageRating: number;
}
export interface FitnessSessionDetailedPublicResponseData extends Omit<
  FitnessSessionResponseData,
  'fitnessCategory' | 'trainerId'
> {
  fitnessCategory: FitnessCategory;
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

export interface IPayload {
  sessionId: string;
  date: string;
  slotId: string;
  slotTime: string;
  planId: string;
  numberOfSessions: number;
  amount: number;
  type: string;
}

export interface session_filter {
  id: string;
  type: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
}
