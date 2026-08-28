import api from '@/api/axiosInstance';
import type { session_filter } from '../store/session.types';
import { GET_SESSION } from './session.api';
import type { SessionPublicResponseData } from '../store/types';

export const sessionService = {
  getSessionDetailsfiltered: async (filter: session_filter) => {
    const response = await api.get(
      GET_SESSION.BY_ID(filter.sessionModel, filter.id)
    );
    return response.data;
  },



  

  semanticSearch: async (query: string): Promise<{ sessions: SessionPublicResponseData[] }> => {
    const { data } = await api.get(`/sessions/search?q=${encodeURIComponent(query)}`);
    return data;
  },

  getAllSessions: async (): Promise<{ sessions: SessionPublicResponseData[] }> => {
    const { data } = await api.get('/sessions');
    return data;
  },
};
