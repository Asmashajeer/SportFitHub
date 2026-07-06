import { DOC_VERIFY_STATUS, TRAINER_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';

import {
  AvailabiltyPricingReqDTO,
  BasicInfoReqDTO,
  CertificationReqDTO, 
  idVerificationReqDTO,
  PaymentInfoReqDTO,
  PersonalInfoReqDTO,
} from '@/dtos/request/trainer/trainer.profile.request.dto';
import { TrainerProfileResponseDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { ITrainerService } from '@/interfaces/services/trainer/Itrainer.service';
import { toTrainerProfileData, ToTrainerProfileDTO } from '@/mappers/trainer/trainer.mapper';
import { AuthUser } from '@/middleware/auth.middleware';
import { ICertification, ITrainerProfile } from '@/models/trainerProfile.model';
import AppError from '@/utils/AppError';
import { formatDateTo } from '@/utils/formatTo';
import { sendPushNotification } from '@/utils/push-notification.service';
import { sendNotificationEmail } from '@/utils/sendNotfication.mail';
import { serializeTrainerProfile } from '@/utils/serializeTrainerProfile';
import { UpdateQuery } from 'mongoose';
import { Types } from 'mongoose';

export class TrainerService implements ITrainerService {
  private _trainerRepo: ITrainerRepository;
  private _userRepo:IUserRepository;
  constructor(trainerRepo: ITrainerRepository,userRepo:IUserRepository) {
    this._trainerRepo = trainerRepo;
     this._userRepo=userRepo;
  }

  async checkExistingProfile(userId: Types.ObjectId|string): Promise<void> {
    const existingProfile = await this._trainerRepo.findByUserId(userId);
    if (existingProfile)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_EXISTS, STATUS_CODE.ERROR.CONFLICT);
  }

  async addProfile(profileData: Partial<ITrainerProfile>,user:AuthUser): Promise<TrainerProfileResponseDTO> {
    await this.checkExistingProfile(profileData.userId);
    const data = await this._trainerRepo.create(profileData);
    const trainerData=serializeTrainerProfile(data, { id: user?.id, role:user?.role })
    const profile: TrainerProfileResponseDTO = toTrainerProfileData(trainerData);
    const userData=await this._userRepo.findById(user.id.toString());
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
            trainerId: trainerData.id.toString(),
          },
        });
      }
    return profile;
  }

  async getTrainer(user:AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(user.id);
    
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const data=serializeTrainerProfile(trainer, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(data);
    return trainerData;
  }

  async getTrainerByUserId(user:AuthUser): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findOne({ userId: user.id });  
   
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const data=serializeTrainerProfile(trainer, { id: user?.id, role:user?.role });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(data);
    return trainerData;
  }

  //-------------------update profile pic----------
  async updateProfilePic(
    id: string | Types.ObjectId,
    profilePic: string,
    user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    
    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, {profilePic:profilePic});

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    return trainerData;
  }


   //--------update basic info------------
  async updateBasicInfo(
    id: string | Types.ObjectId,
    data: BasicInfoReqDTO,
    user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status=trainer.experience!==data.experience?TRAINER_STATUS.VARIFICATION_REQUIRED:trainer.status;
    const changedField=trainer.experience!==data.experience?'experience':"";
    const newData={
      ...data,
      status
    }
    
    const updatedDoc = await this._trainerRepo.updateSection(id, newData,changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
     if(changedField) this.sendVerificationPendingNotification(user,trainer, changedField);
    return trainerData;
  }


  //------------update personal info--
  async updatePersonalInfo(
    id: string | Types.ObjectId,
    data: PersonalInfoReqDTO,
    user:AuthUser
  ): Promise<TrainerProfileDTO> {
    console.log(data);
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
     const status=trainer.personalInfo.fullName!==data.fullName?TRAINER_STATUS.VARIFICATION_REQUIRED:trainer.status;
    const changedField=trainer.personalInfo.fullName!==data.fullName?'fullName':"";
    const newData={
      ...data,
      status
    } 
      
    const updatedDoc = await this._trainerRepo.updateSection(id, {personalInfo:newData},changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
     if(changedField) this.sendVerificationPendingNotification(user,trainer, changedField);  
    return trainerData;
  }


  
  //-----------------update certificates verification status
  async updateCertificate(
    id: string | Types.ObjectId,
    documents:CertificationReqDTO,
    user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
       const status=TRAINER_STATUS.VARIFICATION_REQUIRED;
    const changedField='certificationInfo';
    const newData={
      'certificationInfo.documents': documents,
      'certificationInfo.status': DOC_VERIFY_STATUS.PENDING,
      'certificationInfo.rejectReason': '',
       status
    } 
      
    const updatedDoc = await this._trainerRepo.updateSection(id, newData,changedField);
    
    
    if (!updatedDoc) {
      throw new AppError(
        ERROR_MESSAGES.GENERAL.UPLOAD_FAILED,
        STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR
      );
    }
    const data=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(data);
    if(changedField) this.sendVerificationPendingNotification(user,trainer, changedField);
    return trainerData;
  }

  //---------------update id documents verification status
  async updateIdVerification(
    id: string | Types.ObjectId,
    data: idVerificationReqDTO,
    user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
      const status=trainer.idVerification!==data?TRAINER_STATUS.VARIFICATION_REQUIRED:trainer.status;
    const changedField=trainer.idVerification!==data?'idVerification':"";
    const newData={
      ...data,
      'idVerification.status': DOC_VERIFY_STATUS.PENDING,
      'idVerification.rejectReason': '',
      status,
    }
    
    const updatedDoc = await this._trainerRepo.updateSection(id, newData,changedField);

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
    const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
     if(changedField) this.sendVerificationPendingNotification(user,trainer, changedField);
    return trainerData;
  }

  //-------------update availability and pricing
  async updateAvailabilityPricing(
    id: string | Types.ObjectId,
    data: AvailabiltyPricingReqDTO,
     user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);    
    const changedField="";
    const newData={
      ...data      
    } 
      
    const updatedDoc = await this._trainerRepo.updateSection(id, newData,changedField);   
    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
     const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
    return trainerData;
  }

  //--------------- update payment info
  async updatePaymentInfo(
    id: string | Types.ObjectId,
    data: PaymentInfoReqDTO,
     user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const status=trainer.paymentInfo!==data.paymentInfo?TRAINER_STATUS.VARIFICATION_REQUIRED:trainer.status;
    const changedField=trainer.paymentInfo!==data.paymentInfo?'paymentInfo':"";
    const newData={
      ...data,
      status
    } 
      
    const updatedDoc = await this._trainerRepo.updateSection(id, newData,changedField);      

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }
     const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(result);
     if(changedField) this.sendVerificationPendingNotification(user,trainer, changedField);
    return trainerData;
  }
  

  //----------------------resubmit Application
  async resubmitApplicaion(
    id: string | Types.ObjectId,
    status: TRAINER_STATUS,
    user:AuthUser
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer)
      throw new AppError(ERROR_MESSAGES.TRAINER.TRAINER_NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updateData= {      
        status:status,
        rejectionReason: '',  
    };
    const updatedDoc = await this._trainerRepo.reSubmitApplication(id,updateData);

    if (!updatedDoc) {
      throw new AppError(
        ERROR_MESSAGES.GENERAL.UPDATE_FAILED,
        STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR
      );
    }
     const result=serializeTrainerProfile(updatedDoc, { id: user?.id, role:user?.role })
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }


    private sendVerificationPendingNotification = async (user:AuthUser,trainer: any, fieldName: string) => {
      await sendNotificationEmail({
        to: user.email,
        title: "Your profile update is under review",
        description: `You've updated your ${fieldName}. Our team will review this change before it's reflected on your public profile.`,
        details: {
          userName: trainer.personalInfo.fullName,
          updatedField: fieldName,
          updatedOn: formatDateTo(new Date().toISOString()),
        },
        closingLine: `We'll notify you once the review is complete. This usually takes 1-2 business days.`,
      });
      const userData=await this._userRepo.findById(user.id.toString());
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
