import api from '@/api/axiosInstance';
import type { session_filter } from '../store/session.types';
import { GET_SESSION } from './session.api';

export const sessionService = {
  getSessionDetailsfiltered: async (filter: session_filter) => {
    const response = await api.get(
      GET_SESSION.BY_ID(filter.sessionModel, filter.id)
    );
    return response.data;
  },
};
