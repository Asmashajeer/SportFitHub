import { DOC_VERIFY_STATUS, TRAINER_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';

import {
  AvailabiltyPricingReqDTO,
  idVerificationReqDTO,
  PaymentInfoReqDTO,
} from '@/dtos/request/trainer/trainer.profile.request.dto';
import { TrainerProfileResponseDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ITrainerService } from '@/interfaces/services/trainer/Itrainer.service';
import { toTrainerProfileData, ToTrainerProfileDTO } from '@/mappers/trainer/trainer.mapper';
import { ICertification, ITrainerProfile } from '@/models/trainerProfile.model';
import AppError from '@/utils/AppError';
import { Types } from 'mongoose';

export class TrainerService implements ITrainerService {
  private _trainerRepo: ITrainerRepository;
  constructor(trainerRepo: ITrainerRepository) {
    this._trainerRepo = trainerRepo;
  }

  async checkExistingProfile(userId: Types.ObjectId|string): Promise<void> {
    const existingProfile = await this._trainerRepo.findByUserId(userId);
    if (existingProfile)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_EXISTS, STATUS_CODE.ERROR.CONFLICT);
  }

  async addProfile(profileData: Partial<ITrainerProfile>): Promise<TrainerProfileResponseDTO> {
    await this.checkExistingProfile(profileData.userId);
    const data = await this._trainerRepo.create(profileData);

    const profile: TrainerProfileResponseDTO = toTrainerProfileData(data);
    return profile;
  }

  async getTrainer(id: string | Types.ObjectId): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(trainer);
    return trainerData;
  }
  async getTrainerByUserId(userId: string | Types.ObjectId): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findOne({ userId: userId });
    
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(trainer);
    return trainerData;
  }

  //update certificates verification status
  async updateCertificate(
    id: string | Types.ObjectId,
    documents: ICertification
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const updateQuery = {
      $set: {
        'certificationInfo.documents': documents,
        'certificationInfo.status': DOC_VERIFY_STATUS.PENDING,
        'certificationInfo.rejectReason': '',
      },
    };
    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, updateQuery);
    if (!updatedDoc) {
      throw new AppError(
        ERROR_MESSAGES.GENERAL.UPLOAD_FAILED,
        STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR
      );
    }
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }

  //update id documents verification status
  async updateIdVerification(
    id: string | Types.ObjectId,
    data: idVerificationReqDTO
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const updateQuery = {
      $set: {
        'idVerification.idType': data.idType,
        'idVerification.idNumber': data.idNumber,
        'idVerification.idAttachment': data.idAttachment,
        'idVerification.status': DOC_VERIFY_STATUS.PENDING,
        'idVerification.rejectReason': '',
      },
    };
    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, updateQuery);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }

    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }

  //update availability and pricing
  async updateAvailabilityPricing(
    id: string | Types.ObjectId,
    data: AvailabiltyPricingReqDTO
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const updateQuery = {
      $set: {
        availability: data.availability,
        pricing: data.pricing,
      },
    };
    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, updateQuery);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }

    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }

  // update payment info
  async updatePaymentInfo(
    id: string | Types.ObjectId,
    data: PaymentInfoReqDTO
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const updateQuery = {
      $set: {
        paymentInfo: data.paymentInfo,
      },
    };

    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, updateQuery);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }

    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }

  async resubmitApplicaion(
    id: string | Types.ObjectId,
    status: TRAINER_STATUS
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const updateQuery = {
      $set: {
        status: status,
        rejectionReason: '',
      },
      $inc: {
        applicationCount: 1,
      },
    };
    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, updateQuery);

    if (!updatedDoc) {
      throw new AppError(
        ERROR_MESSAGES.GENERAL.UPDATE_FAILED,
        STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR
      );
    }

    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }
}
