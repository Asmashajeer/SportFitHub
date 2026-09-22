import { DOC_VERIFY_STATUS, TRAINER_STATUS, UserRole } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { getTimezone } from '@/context/timezone.context';

import { AvailabiltyPricingReqDTO, BasicInfoReqDTO, CertificationReqDTO, idVerificationReqDTO, PaymentInfoReqDTO, PersonalInfoReqDTO } from '@/dtos/request/trainer/trainer.profile.request.dto';
import { TrainerProfileResponseDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { IBookingSessionRepository } from '@/interfaces/repositories/IBook.session.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IAuthService } from '@/interfaces/services/IAuth.service';
import { ITrainerService } from '@/interfaces/services/trainer/Itrainer.service';
import { toTrainerProfileData, ToTrainerProfileDTO } from '@/mappers/trainer/trainer.mapper';
import { AuthUser } from '@/middleware/auth.middleware';
import { ITrainerProfile } from '@/models/trainerProfile.model';
import AppError from '@/utils/AppError';
import { isValidTimezone, nextDay } from '@/utils/availability';
import { formatDateTo, toDateStr } from '@/utils/formatTo';
import { sendPushNotification } from '@/utils/push-notification.service';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';
import { serializeTrainerProfile } from '@/utils/serializeTrainerProfile';

import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

import { Types } from 'mongoose';

export class TrainerService implements ITrainerService {
  private _trainerRepo: ITrainerRepository;
  private _userRepo: IUserRepository;
  private _authService: IAuthService;
  private _bookingSessionRepo: IBookingSessionRepository;
  constructor(trainerRepo: ITrainerRepository, userRepo: IUserRepository, authService: IAuthService, bookingSessionRepo: IBookingSessionRepository) {
    this._trainerRepo = trainerRepo;
    this._userRepo = userRepo;
    this._authService = authService;
    this._bookingSessionRepo = bookingSessionRepo;
  }
  async checkExistingProfile(userId: Types.ObjectId | string): Promise<void> {
    const existingProfile = await this._trainerRepo.findByUserId(userId);
    if (existingProfile) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_EXISTS, STATUS_CODE.ERROR.CONFLICT);
  }

  async addProfile(Data: Partial<ITrainerProfile>, user: AuthUser): Promise<TrainerProfileResponseDTO & { tokens?: { accessToken: string; refreshToken: string } }> {
    await this.checkExistingProfile(Data.userId);
    const timezone = Data.availability?.timezone ?? getTimezone(); 
    if (!timezone || !isValidTimezone(timezone)) throw new Error('Timezone is required');
    const effectiveFromUTC= fromZonedTime(Data.availability.effectiveFrom,timezone);
    const effectiveToUTC = Data.availability.effectiveTo
      ? fromZonedTime(new Date(`${nextDay(toDateStr(Data.availability.effectiveTo))}T00:00:00`), timezone)
      : null;
    
    const profileData={
      ...Data,
      availability: {
        ...Data.availability,       
        timezone:timezone,
        effectiveFrom:effectiveFromUTC,
        effectiveTo: effectiveToUTC 
      }
    }
    const data = await this._trainerRepo.create(profileData);
    // const data = await this._trainerRepo.create(profileData);
    const trainerData = serializeTrainerProfile(data, { id: user?.id, role: user?.role });
    const profile: TrainerProfileResponseDTO = toTrainerProfileData(trainerData);
    const userData = await this._userRepo.findById(user.id.toString());

    let tokens: { accessToken: string; refreshToken: string } | undefined;
    //user become a trainer too
    if (user.role === UserRole.USER && !userData.roles.includes(UserRole.TRAINER)) {
      await this._userRepo.addRole(user.id, UserRole.TRAINER);
      const updatedUser = await this._userRepo.setActiveRole(user.id, UserRole.TRAINER);
      tokens = this._authService.generateTokensForUser(updatedUser._id.toString(), updatedUser.email, updatedUser.activeRole, updatedUser.timezone);
    }

    await sendNotificationEmail({
      to: user.email,
      title: "We've received your application",
      description: `Thank you for applying to become a trainer on SportFitHub. Our team will review your profile, certifications, and documents shortly.`,
      details: {
        userName: trainerData.personalInfo.fullName,
        category: trainerData.category,
        submittedOn: formatDateTo(new Date().toISOString()),
      },
      closingLine: `We'll notify you once the review is complete. This usually takes 2-3 business days. You can track your application status anytime from your dashboard.`,
    });

    // sending notification to trainer
    if (userData.fcmToken) {
      await sendPushNotification(userData.fcmToken, {
        title: 'Application Received',
        body: `We're reviewing your trainer application. We'll notify you once it's complete.`,
        data: {
          type: TRAINER_STATUS.SUBMITTED,
          trainerId: trainerData._id.toString(),
        },
      });
    }
    return { ...profile, tokens };
  }

  async getTrainer(user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(user.id);

    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const data = serializeTrainerProfile(trainer, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(data);
    return trainerData;
  }

  async getTrainerByUserId(user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findOne({ userId: user.id });

    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const data = serializeTrainerProfile(trainer, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(data);
    return trainerData;
  }

  //-------------------update profile pic----------
  async updateProfilePic(id: string | Types.ObjectId, profilePic: string, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, { profilePic: profilePic });

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    return trainerData;
  }

  //--------update basic info------------
  async updateBasicInfo(id: string | Types.ObjectId, data: BasicInfoReqDTO, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status = trainer.experience !== data.experience ? TRAINER_STATUS.VARIFICATION_REQUIRED : trainer.status;
    const changedField = trainer.experience !== data.experience ? 'experience' : '';
    const newData = {
      ...data,
      status,
    };

    const updatedDoc = await this._trainerRepo.updateSection(id, newData, changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    if (changedField) this.sendVerificationPendingNotification(user, trainer, changedField);
    return trainerData;
  }

  //------------update personal info--
  async updatePersonalInfo(id: string | Types.ObjectId, data: PersonalInfoReqDTO, user: AuthUser): Promise<TrainerProfileDTO> {
    console.log(data);
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status = trainer.personalInfo.fullName !== data.fullName ? TRAINER_STATUS.VARIFICATION_REQUIRED : trainer.status;
    const changedField = trainer.personalInfo.fullName !== data.fullName ? 'fullName' : '';
    const newData = {
      ...data,
      status,
    };

    const updatedDoc = await this._trainerRepo.updateSection(id, { personalInfo: newData }, changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    if (changedField) this.sendVerificationPendingNotification(user, trainer, changedField);
    return trainerData;
  }

  //-----------------update certificates verification status
  async updateCertificate(id: string | Types.ObjectId, documents: CertificationReqDTO, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status = TRAINER_STATUS.VARIFICATION_REQUIRED;
    const changedField = 'certificationInfo';
    const newData = {
      'certificationInfo.documents': documents,
      'certificationInfo.status': DOC_VERIFY_STATUS.PENDING,
      'certificationInfo.rejectReason': '',
      status,
    };

    const updatedDoc = await this._trainerRepo.updateSection(id, newData, changedField);

    if (!updatedDoc) {
      throw new AppError(ERROR_MESSAGES.GENERAL.UPLOAD_FAILED, STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const data = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(data);
    if (changedField) this.sendVerificationPendingNotification(user, trainer, changedField);
    return trainerData;
  }

  //---------------update id documents verification status
  async updateIdVerification(id: string | Types.ObjectId, data: idVerificationReqDTO, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status = trainer.idVerification !== data ? TRAINER_STATUS.VARIFICATION_REQUIRED : trainer.status;
    const changedField = trainer.idVerification !== data ? 'idVerification' : '';
    const newData = {
      ...data,
      'idVerification.status': DOC_VERIFY_STATUS.PENDING,
      'idVerification.rejectReason': '',
      status,
    };

    const updatedDoc = await this._trainerRepo.updateSection(id, newData, changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    if (changedField) this.sendVerificationPendingNotification(user, trainer, changedField);
    return trainerData;
  }

  //-------------update availability and pricing
 
  async updateAvailabilityPricing(id: string | Types.ObjectId, data: AvailabiltyPricingReqDTO, user: AuthUser): Promise<TrainerProfileDTO> {
    const nextDay = (d: string) => {
      const dt = new Date(`${d}T00:00:00.000Z`);
      dt.setUTCDate(dt.getUTCDate() + 1);
      return dt.toISOString().slice(0, 10);
    };
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    // Trainer A must not edit trainer B
    if (trainer.userId.toString() !== user.id.toString()) {
      throw new AppError('Forbidden', STATUS_CODE.ERROR.FORBIDDEN);
    }

    const tz = trainer.availability?.timezone ?? getTimezone(); 
    const today = formatInTimeZone(new Date(), tz, 'yyyy-MM-dd');

    if (!data.availability.effectiveFrom) {
      throw new AppError('Start date is required', STATUS_CODE.ERROR.BAD_REQUEST);
    }

    const currentFrom = toDateStr(trainer.availability.effectiveFrom);
    const currentTo = trainer.availability.effectiveTo ? toDateStr(trainer.availability.effectiveTo) : null;
    const newFrom =  data.availability.effectiveTo ?toDateStr(fromZonedTime(data.availability.effectiveFrom,tz)):null;
    const newTo = data.availability.effectiveTo ? toDateStr(fromZonedTime(data.availability.effectiveTo,tz)) : null;

    const fromChanged =newFrom!==null && newFrom !== currentFrom;
    const toChanged = newTo !== currentTo;

    // 1. effectiveFrom
    if (fromChanged) {
      if (currentFrom <= today) {
        throw new AppError('Start date of a running schedule cannot be changed', STATUS_CODE.ERROR.BAD_REQUEST);
      }
      if (newFrom < today) {
        throw new AppError('Start date cannot be in the past', STATUS_CODE.ERROR.BAD_REQUEST);
      }
    }

    // 2. effectiveTo validity 
    if (newTo) {
      if (toChanged && newTo < today) {
        throw new AppError('End date cannot be in the past', STATUS_CODE.ERROR.BAD_REQUEST);
      }
      if (newTo < newFrom) {
        throw new AppError('End date cannot be before start date', STATUS_CODE.ERROR.BAD_REQUEST);
      }
    }

    // 3. effectiveTo shortened -> bookings in the removed period block the edit
    const isShortening = newTo !== null && (currentTo === null || newTo < currentTo);
    if (isShortening) {
      const removedFrom = fromZonedTime(`${nextDay(newTo)}T00:00:00`, tz);
      const removedTo = currentTo ? fromZonedTime(`${nextDay(currentTo)}T00:00:00`, tz) : undefined;

      const count = await this._bookingSessionRepo.countScheduledBetween(trainer._id, removedFrom, removedTo);
      if (count > 0) {
        throw new AppError(`${count} booked session(s) exist after ${newTo}. Cancel or reschedule them first.`, STATUS_CODE.ERROR.CONFLICT);
      }
    }

    // 4. effectiveFrom moved later -> bookings in the skipped period block the edit
    if (fromChanged && newFrom > currentFrom) {
      const skippedFrom = fromZonedTime(`${currentFrom}T00:00:00`, tz);
      const skippedTo = fromZonedTime(`${newFrom}T00:00:00`, tz);

      const count = await this._bookingSessionRepo.countScheduledBetween(trainer._id, skippedFrom, skippedTo);
      if (count > 0) {
        throw new AppError(`${count} booked session(s) exist before ${newFrom}. Cancel or reschedule them first.`, STATUS_CODE.ERROR.CONFLICT);
      }
    }

    // Save with dates normalized to UTC midnight (the format already in your DB)
    const newData = {
      ...data,
      availability: {
        ...data.availability,
        effectiveFrom:  newFrom ? new Date(`${newFrom}T00:00:00.000Z`)      : data.availability.effectiveFrom,
        effectiveTo: newTo ? new Date(`${newTo}T00:00:00.000Z`) : null,
      },
    };

    const updatedDoc = await this._trainerRepo.updateSection(id, newData, '');
    if (!updatedDoc) throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);

    const result = serializeTrainerProfile(updatedDoc, { id: user.id, role: user.role });
    return ToTrainerProfileDTO(result);
  }
  //--------------- update payment info
  async updatePaymentInfo(id: string | Types.ObjectId, data: PaymentInfoReqDTO, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status = trainer.paymentInfo !== data.paymentInfo ? TRAINER_STATUS.VARIFICATION_REQUIRED : trainer.status;
    const changedField = trainer.paymentInfo !== data.paymentInfo ? 'paymentInfo' : '';
    const newData = {
      ...data,
      status,
    };

    const updatedDoc = await this._trainerRepo.updateSection(id, newData, changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    if (changedField) this.sendVerificationPendingNotification(user, trainer, changedField);
    return trainerData;
  }

  //----------------------resubmit Application
  async resubmitApplicaion(id: string | Types.ObjectId, status: TRAINER_STATUS, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updateData = {
      status: status,
      rejectionReason: '',
    };
    const updatedDoc = await this._trainerRepo.reSubmitApplication(id, updateData);

    if (!updatedDoc) {
      throw new AppError(ERROR_MESSAGES.GENERAL.UPDATE_FAILED, STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }

  private sendVerificationPendingNotification = async (user: AuthUser, trainer: ITrainerProfile, fieldName: string) => {
    await sendNotificationEmail({
      to: user.email,
      title: 'Your profile update is under review',
      description: `You've updated your ${fieldName}. Our team will review this change before it's reflected on your public profile.`,
      details: {
        userName: trainer.personalInfo.fullName,
        updatedField: fieldName,
        updatedOn: formatDateTo(new Date().toISOString()),
      },
      closingLine: `We'll notify you once the review is complete. This usually takes 1-2 business days.`,
    });
    const userData = await this._userRepo.findById(user.id.toString());
    if (userData.fcmToken) {
      await sendPushNotification(userData.fcmToken, {
        title: 'Update Submitted for Review',
        body: `Your ${fieldName} update is being reviewed by our team.`,
        data: {
          type: TRAINER_STATUS.VARIFICATION_REQUIRED,
          trainerId: trainer.id.toString(),
          field: fieldName,
        },
      });
    }
  };


  
}
