import { TRAINER_STATUS } from '@/constants/enums';
import {
  AvailabiltyPricingReqDTO,
  idVerificationReqDTO,
  PaymentInfoReqDTO,
} from '@/dtos/request/trainer/trainer.profile.request.dto';
import { TrainerProfileResponseDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { ICertification, ITrainerProfile } from '@/models/trainerProfile.model';
import { Types } from 'mongoose';

export interface ITrainerService {
  checkExistingProfile(userId: Types.ObjectId): Promise<void>;
  addProfile(profileData: Partial<ITrainerProfile>): Promise<TrainerProfileResponseDTO>;

  // by trainer and admin
  getTrainer(id: string): Promise<TrainerProfileDTO>;
  getTrainerByUserId(userId: string | Types.ObjectId): Promise<TrainerProfileDTO>;

  updateCertificate(
    id: string | Types.ObjectId,
    documents: ICertification
  ): Promise<TrainerProfileDTO>;
  updateIdVerification(
    id: string | Types.ObjectId,
    data: idVerificationReqDTO
  ): Promise<TrainerProfileDTO>;
  updateAvailabilityPricing(
    id: string | Types.ObjectId,
    data: AvailabiltyPricingReqDTO
  ): Promise<TrainerProfileDTO>;
  updatePaymentInfo(
    id: string | Types.ObjectId,
    data: PaymentInfoReqDTO
  ): Promise<TrainerProfileDTO>;

  resubmitApplicaion(
    id: string | Types.ObjectId,
    status: TRAINER_STATUS
  ): Promise<TrainerProfileDTO>;
}
