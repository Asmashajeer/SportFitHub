import api from '@/api/axiosInstance';
import { ADMIN_ROUTES } from './admin.api';
import type { PAYLOAD_MODEL } from '@/constants/constants';
import type { SessionFilter } from '../store/types';

export const SessionManagementService = {
  getSessionStats: async () => {
    const res = await api.get(ADMIN_ROUTES.GET_SESSION_STATS);
    return res.data;
  },
  getSessions: async (
    sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL],
    params: SessionFilter
  ) => {
    const res = await api.get(ADMIN_ROUTES.GET_SESSIONS + `/${sessionModel}`, {
      params,
    });
    return res.data;
  },
  approveSession: async (
    id: string,
    sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL],
    isApproved: boolean
  ) => {
    const res = await api.patch(
      ADMIN_ROUTES.APPROVE_SESSION.BY_MODEL_ID(id, sessionModel),
      { isApproved }
    );
    return res.data;
  },
  activateSession: async (
    id: string,
    sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL],
    isActive: boolean
  ) => {
    const res = await api.patch(
      ADMIN_ROUTES.ACTIVATE_SESSION.BY_MODEL_ID(id, sessionModel),
      { isActive }
    );
    return res.data;
  },
  getSessionById:async(
    id: string,
    sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL],)=>{
      const res = await api.get(ADMIN_ROUTES.GET_SESSION.BY_ID (id, sessionModel));     
      return res.data;
    }
};
