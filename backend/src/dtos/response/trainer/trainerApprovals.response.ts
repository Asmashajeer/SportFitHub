import { TRAINER_CATEGORY, TRAINER_STATUS } from '@/constants/enums';

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
  createdAt: string; // Timestamps
  certCount: number;
}
