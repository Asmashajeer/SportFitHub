import api from '@/api/axiosInstance';
import { PUBLIC_ROUTE } from '@/service/public.api';


interface queryParamsOptions {
  page: number;
  search?: string;
  sport?: string;
  ageGroup?: string;
  minRating?:number;
  sessionType?: string;
  limit?: number;
  lat:number,
  lng:number,
  radius:number
}
export const sportSessionService = {
  getAvailableSports: async () => {
      const response = await api.get(PUBLIC_ROUTE.GET_All_SPORTS);
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
