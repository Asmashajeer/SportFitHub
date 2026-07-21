import { AGE_GROUP, DAY, GENDER, INTENSITY_LEVEL, SESSION_MODE, SESSION_TYPE } from '@/constants/enums';

import { Types } from 'mongoose';
import { PaginationResponseDTO } from '../pagination.response.dto';
import { IFitnessSession } from '@/models/fitnessSession.model';

export interface IPopulatedFitnessPgm {
  _id: Types.ObjectId;
  programName: string;
  slug: string;
  description: string;
}
interface IVenue {
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface ITimeSlot {
  day: DAY;
  slots: {
    startTime: string; // "09:00"
    endTime: string; // "10:00"
    _id?: string;
  }[];
  _id?: string;
}
interface IPricing {
  sessionCount: number;
  price: number;
  _id?: string;
}

export interface IFitnessSessionPopulated {
  _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  fitnessCategory: IPopulatedFitnessPgm;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: AGE_GROUP;
  gender: GENDER;
  sessionType: SESSION_TYPE;
  enrolledCount: number;
  maxCapacity: number;
  intensityLevel: INTENSITY_LEVEL;
  mode: SESSION_MODE;
  meetingLink?: string; // Required if mode === ONLINE
  venue?: IVenue; // Required if mode === OFFLINE
  amenities?: string[]; // Required if mode === OFFLINE
  requirements: string[];
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
  updatedAt: Date;
  createdAt: Date;
}

interface IPopulatedTrainer {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  displayName: string;
  profilePic: string;
  coreDiscipline: string;
  specialties: string[];
  experience: number;
  languages: string[];
  averageRating: number;
}
export interface IFitnessSessionDetailsPopulated extends Omit<IFitnessSessionPopulated, 'trainerId'> {
  trainerId: IPopulatedTrainer;
}

export interface FitnessSessionResponseDTO {
  id: string;
  trainerId: string;
  fitnessCategory: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: AGE_GROUP;
  gender: GENDER;
  sessionType: SESSION_TYPE;
  maxCapacity: number;
  enrolledCount: number;
  intensityLevel: INTENSITY_LEVEL;
  mode: SESSION_MODE;
  meetingLink?: string;
  venue: IVenue;
  amenities: string[];
  requirements: string[];
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

interface FitnessCategory extends Omit<IPopulatedFitnessPgm, '_id'> {
  id: string;
}

interface PopulatedTrainer extends Omit<IPopulatedTrainer, '_id' | 'userId'> {
  id: string;
  userId: string;
}
export interface FitnessSessionPublicDTO extends Omit<FitnessSessionResponseDTO, 'fitnessCategory'> {
  fitnessCategory: FitnessCategory;
}

export interface FitnessSessionDetailedPublicDTO extends Omit<FitnessSessionResponseDTO, 'fitnessCategory' | 'trainerId'> {
  fitnessCategory: FitnessCategory;
  trainer: PopulatedTrainer;
}

export interface GetFitnessSessionsResponseDTO {
  sessions: FitnessSessionPublicDTO[]; // The data
  pagination: PaginationResponseDTO; // The metadata
}
export interface PaginatedSessions {
  sessions: IFitnessSession[];
  pagination: PaginationResponseDTO;
}
export interface PaginatedFitnessSessionsResponseDTO {
  sessions: FitnessSessionResponseDTO[];
  pagination: PaginationResponseDTO;
}
