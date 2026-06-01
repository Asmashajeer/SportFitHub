import api from '@/api/axiosInstance';

import { FITNESS_SESSION_ROUTE } from './session.api';
import type { FitnessSessionData } from '../store/fitness.session.types';
import { PUBLIC_ROUTE } from '@/service/public.api';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';

interface queryParamsOptions {
  page: number;
  search?: string;
  program?: string;
  ageGroup?: string;
  sessionType?: string;
  limit?: number;
}
export const fitnessSessionService = {
  addSession: async (sessionData: FitnessSessionData) => {
    const response = await api.post(
      FITNESS_SESSION_ROUTE.ADD_FITNESS_SESSION,
      sessionData
    );
    return response.data;
  },
  updateSession: async (sessionId: string, sessionData: FitnessSessionData) => {
    const response = await api.put(
      FITNESS_SESSION_ROUTE.UPDATE_FITNESS_SESSION.BY_ID(sessionId),
      sessionData
    );
    return response.data;
  },
  deleteSession: async (sessionId: string) => {
    const response = await api.patch(
      FITNESS_SESSION_ROUTE.UPDATE_FITNESS_SESSION.BY_ID(sessionId)
    );
    return response.data;
  },
  getAvailableFitnessPgms: async () => {
    const response = await api.get(PUBLIC_ROUTE.GET_All_FITNESS);
    return response.data;
  },
  getTrainerSessions: async (queryParams: queryParamsOptions) => {
    queryParams.limit = PAGINATION_DEFAULT_LIMIT;
    const params = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== '' && value !== undefined
      )
    );
    const response = await api.get(FITNESS_SESSION_ROUTE.GET_SESSIONS, {
      params,
    });
    return response.data;
  },

  getAllSessions: async (params: queryParamsOptions) => {
    const response = await api.get(PUBLIC_ROUTE.GET_FITNESS_SESSIONS, { params});
    return response.data;
  },
  getSessionById: async (sessionId: string) => {
    const response = await api.get(
      PUBLIC_ROUTE.GET_FITNESS_SESSION.BY_ID(sessionId)
    );
    return response.data;
  },
};
