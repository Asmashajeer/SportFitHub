import api from '@/api/axiosInstance';
import { ADMIN_ROUTES } from './admin.api';
import type { Doc_status_type } from '@/constants/constants';
import type { TrainerFilter } from '../store/types';

export const trainerManagementService = {
  getTrainers: async (params:TrainerFilter) => {
    const response = await api.get(ADMIN_ROUTES.GET_TRAINERS,{params});
    return response.data;
  },
  getPendingTrainers: async () => {
    const response = await api.get(ADMIN_ROUTES.GET_PENDING_TRAINERS);
    return response.data;
  },
  getTrainer: async (id: string) => {
    const response = await api.get(`${ADMIN_ROUTES.GET_TRAINER}/${id}`);
    return response.data;
  },
  updateFileStatus: async (
    id: string,
    targetField: 'certificationInfo' | 'idVerification',
    status: Doc_status_type,
    reason?: string
  ) => {
    const response = await api.patch(
      `${ADMIN_ROUTES.TRAINERS}/${id}/file-status`,
      { id, targetField, status, reason }
    );
    return response.data;
  },
  updateTrainerStatus: async (
    id: string,
    status: Doc_status_type,
    reason?: string
  ) => {
    const response = await api.patch(
      `${ADMIN_ROUTES.TRAINERS}/${id}/trainer-status`,
      { id, status, reason }
    );
    return response.data;
  },
};
