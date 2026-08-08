import { AGE_GROUP, SESSION_MODE, SESSION_TYPE } from '@/constants/enums';
import { IPricing, ITimeSlot, IVenue, PopulatedTrainer } from '../session/sports.session.response.dto';
export interface AdminSessionResponse {
  id: string;
  sessionName: string;
  trainer: { name: string };
  category: string;
  sessionType: string;
  mode: string;
  ageGroup: string;
  enrolledCount: number;
  maxCapacity: number;
  pricing: { sessionCount: number; price: number }[];
  isActive: boolean;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface AdminSessionsResponseDTO {
  sessions: AdminSessionResponse;
  total: number;
  totalPages: number;
  page: number;
}

export interface AdminSessionActionResponseDTO extends Omit<AdminSessionResponse, 'trainer'> {
  trainer: string;
}

export interface SessionResponseDTO {
  id: string;
  trainerId: string;
  category: string;
  sessionName: string;
  description: string;
  duration: number;
  ageGroup: AGE_GROUP;
  sessionType: SESSION_TYPE;
  maxCapacity: number;
  enrolledCount: number;
  mode: SESSION_MODE;
 
  venue: IVenue;
  amenities: string[];
  timeSlots: ITimeSlot[];
  pricing: IPricing[];
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
  isActive: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  images: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}
interface TrainerDetails extends PopulatedTrainer {
  isIdVerified: boolean;
  isCertificateVerified: boolean;
  joinedAt: string;
}
export interface AdminSessionDetailedViewDTO extends Omit<SessionResponseDTO, 'trainerId'> {
  trainer: TrainerDetails;
}
