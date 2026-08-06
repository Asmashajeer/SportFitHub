import { TRAINER_STATUS } from '@/constants/enums';
import { AvailabiltyPricingReqDTO, BasicInfoReqDTO, CertificationReqDTO, idVerificationReqDTO, PaymentInfoReqDTO, PersonalInfoReqDTO } from '@/dtos/request/trainer/trainer.profile.request.dto';
import { TrainerProfileResponseDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { AuthUser } from '@/middleware/auth.middleware';
import { ITrainerProfile } from '@/models/trainerProfile.model';
import { Types } from 'mongoose';

export interface ITrainerService {
  checkExistingProfile(userId: Types.ObjectId | string): Promise<void>;
  addProfile(profileData: Partial<ITrainerProfile>, user: AuthUser): Promise<TrainerProfileResponseDTO & { tokens?: { accessToken: string; refreshToken: string } }>;

  // by trainer and admin
  getTrainer(user: AuthUser): Promise<TrainerProfileDTO>;
  getTrainerByUserId(user: AuthUser): Promise<TrainerProfileDTO>;
  updateProfilePic(id: string | Types.ObjectId, profilePic: string, user: AuthUser): Promise<TrainerProfileDTO>;
  updateBasicInfo(id: string | Types.ObjectId, data: BasicInfoReqDTO, user: AuthUser): Promise<TrainerProfileDTO>;
  updatePersonalInfo(id: string | Types.ObjectId, data: PersonalInfoReqDTO, user: AuthUser): Promise<TrainerProfileDTO>;
  updateCertificate(id: string | Types.ObjectId, documents: CertificationReqDTO, user: AuthUser): Promise<TrainerProfileDTO>;

  updateIdVerification(id: string | Types.ObjectId, data: idVerificationReqDTO, user: AuthUser): Promise<TrainerProfileDTO>;

  updateAvailabilityPricing(id: string | Types.ObjectId, data: AvailabiltyPricingReqDTO, user: AuthUser): Promise<TrainerProfileDTO>;

  updatePaymentInfo(id: string | Types.ObjectId, data: PaymentInfoReqDTO, user: AuthUser): Promise<TrainerProfileDTO>;

  resubmitApplicaion(id: string | Types.ObjectId, status: TRAINER_STATUS, user: AuthUser): Promise<TrainerProfileDTO>;
}
