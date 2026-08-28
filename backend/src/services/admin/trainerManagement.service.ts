import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ITrainerManagementService } from '@/interfaces/services/admin/ITrainerManagementService';
import AppError from '@/utils/AppError';
import { FilterQuery, Types } from 'mongoose';
import { DOC_VERIFY_STATUS, TRAINER_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';

import { DocumentUpdateDTO, TrainerFilterRequestDTO, trainerStatusDTO } from '@/dtos/request/admin/admin.trainer.dto';
import { toPendingTrainersBasicData, ToTrainerProfileDTO } from '@/mappers/trainer/trainer.mapper';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { ITrainerProfile } from '@/models/trainerProfile.model';
import { AdminTrainersDTOWithPagination, PendingTrainersBasicDTO, TrainerProfileDTOPopulatedUser } from '@/dtos/response/admin/trainer.response.dto';
import { toAdminTrainersResponseDTO, toTrainerProfileDTOPopulatedUser } from '@/mappers/admin/admin.trainers.mappers';
import { serializeTrainerProfile } from '@/utils/serializeTrainerProfile';
import { AuthUser } from '@/middleware/auth.middleware';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';
import { formatDateTo } from '@/utils/formatTo';
import { sendPushNotification } from '@/utils/push-notification.service';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';

export class TrainerManagementService implements ITrainerManagementService {
  private _trainerRepo: ITrainerRepository;
  private _userRepo: IUserRepository;
  constructor(trainerRepo: ITrainerRepository, userRepo: IUserRepository) {
    this._trainerRepo = trainerRepo;
    this._userRepo = userRepo;
  }

  //--------------all ltrainers-----------
  async getTrainers(filter: TrainerFilterRequestDTO, user: AuthUser): Promise<AdminTrainersDTOWithPagination> {
    const { page, limit, search, status, category } = filter;
    const skip = (page - 1) * limit;

    const query: FilterQuery<ITrainerProfile> = {};

    if (search) {
      query.$or = [{ displayName: { $regex: search, $options: 'i' } }, { specialities: { $regex: search, $options: 'i' } }, { coreDiscipline: { $regex: search, $options: 'i' } }];
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    const [trainers, totalCount] = await Promise.all([await this._trainerRepo.findAll(query, { skip, limit }), await this._trainerRepo.count(query)]);
    
    const result = trainers.map((trainer) => serializeTrainerProfile(trainer, { id: user?.id, role: user?.role }));
    const trainersData = result.map((t) => toAdminTrainersResponseDTO(t));
    return {
      trainers: trainersData,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
    };
  }

  //-------------get approval pending trainers-----------
  async getPendingTrainers(user: AuthUser): Promise<PendingTrainersBasicDTO[]> {
    const pendingTrainers = await this._trainerRepo.find({
      status: { $in: [TRAINER_STATUS.SUBMITTED, TRAINER_STATUS.UNDER_REVIEW, TRAINER_STATUS.VARIFICATION_REQUIRED] },
    });
    const result = pendingTrainers.map((trainer) => serializeTrainerProfile(trainer, { id: user?.id, role: user?.role }));
    const pendingTrainersBasicData: PendingTrainersBasicDTO[] = result.map((trainer) => toPendingTrainersBasicData(trainer));
    return pendingTrainersBasicData;
  }
  async trainerDetailsById(id: string, user: AuthUser): Promise<TrainerProfileDTOPopulatedUser> {
    const trainer = await this._trainerRepo.findTrainerPopulatedUserId(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const result = serializeTrainerProfile(trainer, { id: user?.id, role: user?.role });
    const trainerData = toTrainerProfileDTOPopulatedUser(result);
    return trainerData;
  }
  async trainerDetailsByUserId(user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findOne({ userId: user.id });
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const result = serializeTrainerProfile(trainer, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    return trainerData;
  }
  async updateFileStatus(id: string | Types.ObjectId, targetField: 'certificationInfo' | 'idVerification', status: string, reason: string, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updateData: DocumentUpdateDTO = {
      [`${targetField}.status`]: status,
      [`${targetField}.rejectReason`]: status === DOC_VERIFY_STATUS.REJECTED ? reason : '',
    };

    if (status === 'verified') {
      updateData[`${targetField}.verified`] = true;
      updateData[`${targetField}.verifiedAt`] = new Date().toISOString();
    } else {
      updateData[`${targetField}.verified`] = false;
    }

    const updatedData = await this._trainerRepo.findOneAndUpdate(id, { $set: updateData });
    const result = serializeTrainerProfile(updatedData, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    await this._sendDocumentStatusNotification(updatedData, targetField, status, reason);
    return trainerData;
  }

  async updateTrainerStatus(id: string | Types.ObjectId, status: TRAINER_STATUS, reason: string, user: AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updateData: trainerStatusDTO = {
      status: status,
    };

    if (status === TRAINER_STATUS.REJECTED) {
      updateData.rejectionReason = reason || '';
      updateData.rejectedAt = new Date();
    }
    updateData.verificationRemarks = {
      fields: [],
      changedAt: null,
    };
    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, { $set: updateData });
    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result = serializeTrainerProfile(updatedDoc, { id: user?.id, role: user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    await this._sendTrainerStatusNotification(updatedDoc, status, reason);
    return trainerData;
  }

  // ---------function to send Email anfd Push Notification after Document verification
  private async _sendDocumentStatusNotification(trainer: ITrainerProfile, targetField: 'certificationInfo' | 'idVerification', status: string, reason: string) {
    const fieldLabel = targetField === 'certificationInfo' ? 'Certifications' : 'ID Document';
    const isVerified = status === DOC_VERIFY_STATUS.VERIFIED;
    const trainerLoginData = await this._userRepo.findById(trainer.userId.toString());
    if (isVerified) {
      await sendNotificationEmail({
        to: trainerLoginData.email,
        title: `Your ${fieldLabel} has been verified`,
        description: `Your ${fieldLabel.toLowerCase()} has been reviewed and verified successfully.`,
        details: {
          userName: trainer.personalInfo?.fullName,
          verifiedField: fieldLabel,
          verifiedOn: formatDateTo(new Date().toISOString()),
        },
        closingLine: `Thank you for keeping your profile up to date!`,
      });

      if (trainerLoginData.fcmToken) {
        await sendPushNotification(trainerLoginData.fcmToken, {
          title: `${fieldLabel} Verified`,
          body: `Your ${fieldLabel.toLowerCase()} has been verified successfully.`,
          data: {
            type: DOC_VERIFY_STATUS.VERIFIED,
            trainerId: trainer._id.toString(),
            field: targetField,
          },
        });
      }
    } else {
      await sendNotificationEmail({
        to: trainerLoginData.email,
        title: `Your ${fieldLabel} needs attention`,
        description: `We reviewed your ${fieldLabel.toLowerCase()} and it requires changes before it can be verified.`,
        details: {
          userName: trainer.personalInfo?.fullName,
          rejectedField: fieldLabel,
          reason: reason,
        },
        closingLine: `Please update your ${fieldLabel.toLowerCase()} and resubmit. If you have questions, contact our support team.`,
      });

      if (trainerLoginData.fcmToken) {
        await sendPushNotification(trainerLoginData.fcmToken, {
          title: `${fieldLabel} Rejected`,
          body: `Your ${fieldLabel.toLowerCase()} needs to be updated. Reason: ${reason}`,
          data: {
            type: DOC_VERIFY_STATUS.REJECTED,
            trainerId: trainer._id.toString(),
            field: targetField,
            reason,
          },
        });
      }
    }
  }

  //----------------function to send Email and push Notification after Application Verifiacation
  private async _sendTrainerStatusNotification(trainer: ITrainerProfile, status: TRAINER_STATUS, reason: string) {
    const userName = trainer.personalInfo?.fullName;
    const trainerLoginData = await this._userRepo.findById(trainer.userId.toString());
    switch (status) {
      case TRAINER_STATUS.APPROVED: {
        await sendNotificationEmail({
          to: trainerLoginData.email,
          title: 'Your trainer application has been approved',
          description: `Congratulations! Your trainer application has been reviewed and approved. Your profile is now live on SportFitHub.`,
          details: {
            userName,
            approvedOn: formatDateTo(new Date().toISOString()),
          },
          closingLine: `Welcome aboard! Start setting your availability and connecting with clients.`,
        });

        if (trainerLoginData.fcmToken) {
          await sendPushNotification(trainerLoginData.fcmToken, {
            title: 'Application Approved 🎉',
            body: 'Your trainer profile is now live!',
            data: {
              type: TRAINER_STATUS.APPROVED,
              trainerId: trainer._id.toString(),
            },
          });
        }
        break;
      }

      case TRAINER_STATUS.REJECTED: {
        await sendNotificationEmail({
          to: trainerLoginData.email,
          title: 'Your trainer application needs attention',
          description: `We reviewed your application and it requires some changes before it can be approved.`,
          details: {
            userName,
            reason: reason || 'Please check your dashboard for details.',
          },
          closingLine: `Please update your profile and resubmit. If you have questions, contact our support team.`,
        });

        if (trainerLoginData.fcmToken) {
          await sendPushNotification(trainerLoginData.fcmToken, {
            title: 'Application Rejected',
            body: reason || 'Please review the feedback and resubmit your application.',
            data: {
              type: TRAINER_STATUS.REJECTED,
              trainerId: trainer._id.toString(),
              reason,
            },
          });
        }
        break;
      }

      case TRAINER_STATUS.UNDER_REVIEW: {
        await sendNotificationEmail({
          to: trainerLoginData.email,
          title: 'Your application is under review',
          description: `Our team has started reviewing your trainer application.`,
          details: { userName },
          closingLine: `We'll notify you as soon as the review is complete.`,
        });

        if (trainerLoginData.fcmToken) {
          await sendPushNotification(trainerLoginData.fcmToken, {
            title: 'Application Under Review',
            body: 'Our team is currently reviewing your application.',
            data: {
              type: TRAINER_STATUS.UNDER_REVIEW,
              trainerId: trainer._id.toString(),
            },
          });
        }
        break;
      }

      case TRAINER_STATUS.SUSPENDED: {
        await sendNotificationEmail({
          to: trainerLoginData.email,
          title: 'Your trainer account has been suspended',
          description: `Your trainer account has been temporarily suspended.${reason ? ` Reason: ${reason}` : ''}`,
          details: { userName },
          closingLine: `Please contact our support team for more information.`,
        });

        if (trainerLoginData.fcmToken) {
          await sendPushNotification(trainerLoginData.fcmToken, {
            title: 'Account Suspended',
            body: reason || 'Your trainer account has been suspended. Contact support for details.',
            data: {
              type: TRAINER_STATUS.SUSPENDED,
              trainerId: trainer._id.toString(),
            },
          });
        }
        break;
      }

      default:
        // SUBMITTED, VARIFICATION_REQUIRED — usually triggered by trainer actions, not admin
        break;
    }
  }
}
