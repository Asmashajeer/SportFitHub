import api from '@/api/axiosInstance';

import { FITNESS_SESSION_ROUTE } from '../trainer.api';
import type { FitnessSessionData } from '../../types/trainer.fitness.session.types';

import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';

interface queryParamsOptions {
  page: number;
  search?: string;
  program?: string;
  ageGroup?: string;
  sessionType?: string;
  limit?: number;
}
export const TrainerFitnessSessionService = {
  addSession: async (sessionData: FitnessSessionData) => {
    const response = await api.post(FITNESS_SESSION_ROUTE.ADD_FITNESS_SESSION, sessionData);
    return response.data;
  },
  updateSession: async (sessionId: string, sessionData: FitnessSessionData) => {
    const response = await api.put(FITNESS_SESSION_ROUTE.FITNESS_SESSION.BY_ID(sessionId), sessionData);
    return response.data;
  },
  deleteSession: async (sessionId: string) => {
    const response = await api.patch(FITNESS_SESSION_ROUTE.FITNESS_SESSION.BY_ID(sessionId));
    return response.data;
  },

  getTrainerSessions: async (queryParams: queryParamsOptions) => {
    queryParams.limit = PAGINATION_DEFAULT_LIMIT;
    const params = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== undefined));
    const response = await api.get(FITNESS_SESSION_ROUTE.GET_SESSIONS, {
      params,
    });
    return response.data;
  },
  updateSessionVisibility: async (sessionId: string, isActive: boolean) => {
    const response = await api.patch(FITNESS_SESSION_ROUTE.FITNESS_SESSION.BY_ID(sessionId), { isActive });
    return response.data;
  },
}