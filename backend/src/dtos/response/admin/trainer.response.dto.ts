import { TRAINER_CATEGORY, TRAINER_STATUS } from '@/constants/enums';
import { PaginationResponseDTO } from '../pagination.response.dto';
import { TrainerProfileDTO } from '../trainer/trainer.response.dto';
import { ITrainerProfile } from '@/models/trainerProfile.model';

export interface AdminTrainersResponseDTO {
  id: string;
  userId: string;
  email: string;
  // basic Info Branding
  category: TRAINER_CATEGORY;
  displayName: string;
  coreDiscipline: string;
  specialties: string[];
  experience: number;
  languages: string[];
  isCertsVerified: boolean;
  isIdVerified: boolean;
  verificationRemarks: {
    fields: string[];
    changedAt: string;
  };
  status: TRAINER_STATUS;
  createdAt: string;
}
export interface AdminTrainersDTOWithPagination extends PaginationResponseDTO {
  trainers: AdminTrainersResponseDTO[];
}

export interface PendingTrainersBasicDTO {
  id: string;
  userId: string;

  category: (typeof TRAINER_CATEGORY)[keyof typeof TRAINER_CATEGORY]; // basic Info Branding
  displayName: string;
  specialties: string[];
  experience: number;
  profilePic: string;

  personalInfo: {
    // Personal Info
    fullName: string;
    phone: string;
  };

  status: (typeof TRAINER_STATUS)[keyof typeof TRAINER_STATUS]; // Trainer State
  verificationRemarks: {
    fields: string[];
    changedAt: string;
  };
  createdAt: string; // Timestamps
  certCount: number;
}

export interface ITrainerPopulated extends Omit<ITrainerProfile, 'userId'> {
  userId: { _id: string; email: string; fcmToken?: string; name?: string };
}

export interface TrainerProfileDTOPopulatedUser extends TrainerProfileDTO {
  email: string;
  fcmToken?: string;
}
