import { TRAINER_STATUS } from '@/constants/enums';
import { ITrainerProfile } from '@/models/trainerProfile.model';
import { Types } from 'mongoose';

export interface PenaltyRequestData {
  penalty?: number;
  strikePoints?: number;
  cancellationCount?: number;
  lastStrikeDate?: Date;
  status?: (typeof TRAINER_STATUS)[keyof typeof TRAINER_STATUS];
  suspensionReason?: string;
  suspendedAt?: Date;
}

export interface TrainerProfilewithPopulatedUser extends Omit<ITrainerProfile, 'userId'> {
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}
