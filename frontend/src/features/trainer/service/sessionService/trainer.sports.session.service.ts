import api from '@/api/axiosInstance';
import { SPORTS_SESSION_ROUTE } from '../trainer.api';
import type { SportsSessionData } from '../../types/trainer.sports.session.types';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';

interface queryParamsOptions {
  page: number;
  search?: string;
  sport?: string;
  ageGroup?: string;
  sessionType?: string;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}
export const TrainerSportSessionService = {
  addSession: async (sessionData: SportsSessionData) => {
    const response = await api.post(SPORTS_SESSION_ROUTE.ADD_SPORT_SESSION, sessionData);
    return response.data;
  },

  getSessionByIdToUpdate: async (sessionId: string) => {
    const response = await api.get(SPORTS_SESSION_ROUTE.SPORT_SESSION_TO_UPDATE.BY_ID(sessionId));
    return response.data;
  },

  updateSession: async (sessionId: string, sessionData: SportsSessionData) => {
    const response = await api.put(SPORTS_SESSION_ROUTE.SPORT_SESSION.BY_ID(sessionId), sessionData);
    return response.data;
  },

  deleteSession: async (sessionId: string) => {
    const response = await api.delete(SPORTS_SESSION_ROUTE.SPORT_SESSION.BY_ID(sessionId));
    return response.data;
  },

  getTrainerSessions: async (queryParams: queryParamsOptions) => {
    queryParams.limit = PAGINATION_DEFAULT_LIMIT;
    const params = Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== '' && value !== undefined));
    const response = await api.get(SPORTS_SESSION_ROUTE.GET_SESSIONS, {
      params,
    });
    return response.data;
  },

  updateSessionVisibility: async (sessionId: string, isActive: boolean) => {
    const response = await api.patch(SPORTS_SESSION_ROUTE.SPORT_SESSION.BY_ID(sessionId), { isActive });
    return response.data;
  },
}