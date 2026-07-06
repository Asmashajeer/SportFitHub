import api from '@/api/axiosInstance';
import type { AddTrainerProfileData, basicInfoData, PersonalInfoData } from '../types/trainer.profile.schema';
import type {
  AvailabiltyPricing,

  idVerificationwithUrl,
  paymentInfoData,

  TrainerProfileResponseData,
} from '../types/trainerprofile.types';
import { TRAINER_ROUTES } from './trainer.api';
import type { ProfilePicResponse } from '@/features/user/types/user.types';
import type { ICertification } from '../store/useTrainerStore';
import type { Trainer_status_type } from '@/constants/constants';

export const trainerService = {
  addProfile: async (
    profile: AddTrainerProfileData
  ): Promise<TrainerProfileResponseData> => {
    const response = await api.post(TRAINER_ROUTES.ADD_PROFILE, profile);
    return response.data;
  },
  getProfilePic: async (): Promise<ProfilePicResponse> => {
    const response = await api.get(TRAINER_ROUTES.GET_PROFILE_PIC);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get(TRAINER_ROUTES.GET_PROFILE);
    return response.data;
  },
  updateProfilePic:async (id: string, profilePic: string) => {
    const response = await api.patch(TRAINER_ROUTES.UPDATE_PROFILE_PIC.BY_ID(id), {
      profilePic,
    });
    return response.data;
  },
  updateBasicInfo:async (id: string, data: basicInfoData) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/basicInfo',
      data
    );
    return response.data;
  },
  updatePersonalInfo:async (id: string, data: PersonalInfoData) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/personalInfo',
      data
    );
    return response.data;
  },
  updateCertificationInfo: async (id: string, documents: ICertification[]) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/certificationInfo',
      {documents}
    );
    return response.data;
  },

  updateIdverification: async (id: string, data: idVerificationwithUrl) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/idVerification',
      data
    );
    return response.data;
  },
  updateAvailability_Pricing: async (id: string, data: AvailabiltyPricing) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/availability_pricing',
      data
    );
    return response.data;
  },
  updatePaymentInfo: async (id: string, data: paymentInfoData) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/paymentInfo',
      data
    );
    return response.data;
  },
  updateTrainerStatus: async (id: string, newStatus: Trainer_status_type) => {
    const response = await api.patch(
      TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + `/trainer-status`,
      { status: newStatus }
    );
    return response.data;
  },
};
