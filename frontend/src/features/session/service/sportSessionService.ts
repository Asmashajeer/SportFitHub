import api from '@/api/axiosInstance';

import { SPORTS_SESSION_ROUTE } from './session.api';
import type { SportsSessionData } from '../store/session.types';
import { PUBLIC_ROUTE } from '@/service/public.api';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';

interface queryParamsOptions {
  page: number;
  search?: string;
  sport?: string;
  ageGroup?: string;
  sessionType?: string;
  limit?: number;
  lat:number,
  lng:number,
  radius:number
}
export const sportSessionService = {
  addSession: async (sessionData: SportsSessionData) => {
    const response = await api.post(
      SPORTS_SESSION_ROUTE.ADD_SPORT_SESSION,
      sessionData
    );
    return response.data;
  },
  updateSession: async (sessionId: string, sessionData: SportsSessionData) => {
    const response = await api.put(
      SPORTS_SESSION_ROUTE.UPDATE_SPORT_SESSION.BY_ID(sessionId),
      sessionData
    );
    return response.data;
  },
  deleteSession: async (sessionId: string) => {
    const response = await api.patch(
      SPORTS_SESSION_ROUTE.UPDATE_SPORT_SESSION.BY_ID(sessionId)
    );
    return response.data;
  },
  getAvailableSports: async () => {
    const response = await api.get(PUBLIC_ROUTE.GET_All_SPORTS);
    return response.data;
  },
  getTrainerSessions: async (queryParams: queryParamsOptions) => {
    queryParams.limit = PAGINATION_DEFAULT_LIMIT;
    const params = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== '' && value !== undefined
      )
    );
    const response = await api.get(SPORTS_SESSION_ROUTE.GET_SESSIONS, {
      params,
    });
    return response.data;
  },

  getAllSessions: async (params: queryParamsOptions) => {

    const response = await api.get(PUBLIC_ROUTE.GET_SPORTS_SESSIONS, {
      params,
    });
    return response.data;
  },

  getSessionById: async (sessionId: string) => {
    const response = await api.get(
      PUBLIC_ROUTE.GET_SPORTS_SESSION.BY_ID(sessionId)
    );
    return response.data;
  },
};
