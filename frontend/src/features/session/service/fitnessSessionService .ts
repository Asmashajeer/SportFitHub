import api from '@/api/axiosInstance';
import { PUBLIC_ROUTE } from '@/service/public.api';

interface queryParamsOptions {
  page: number;
  search?: string;
  program?: string;
  ageGroup?: string;
  minRating?:number;
  sessionType?: string;
  limit?: number;
}
export const fitnessSessionService = {
  getAvailableFitnessPgms: async () => {
      const response = await api.get(PUBLIC_ROUTE.GET_All_FITNESS);
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
