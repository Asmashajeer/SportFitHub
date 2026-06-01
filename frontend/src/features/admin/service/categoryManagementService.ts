import api from '@/api/axiosInstance';

import type {
  FitnessData,
  queryParamsOptions,
  SportData,
} from '../store/types';
import { ADMIN_ROUTES } from './admin.api';

export const CategoryMangementService = {
  getSports: async (queryParams?: queryParamsOptions) => {
    const params: queryParamsOptions = { page: 1 };
    if (queryParams?.search) {
      params.search = queryParams.search;
    }
    if (queryParams?.status) {
      params.status = queryParams.status;
    }
    const response = await api.get(ADMIN_ROUTES.GET_SPORTS, { params });
    return response.data;
  },
  addSport: async (sport: Partial<SportData>) => {
    const response = await api.post(ADMIN_ROUTES.ADD_SPORT, sport);
    return response.data;
  },
  toggleSportStatus: async (id: string) => {
    const response = await api.patch(
      ADMIN_ROUTES.TOGGLE_SPORT_STATUS + '/' + id
    );
    return response.data;
  },
  updateSport: async (sport: SportData) => {
    const id = sport.id;
    const response = await api.put(ADMIN_ROUTES.UPDATE_SPORT + id, sport);
    return response.data;
  },
  deleteSport: async (id: string) => {
    const response = await api.delete(ADMIN_ROUTES.DELETE_SPORT + '/' + id);
    return response.data;
  },

  // ------------------------fitnessManagement-------------------
  getPrograms: async (queryParams?: queryParamsOptions) => {
    const params: queryParamsOptions = { page: 1 };
    if (queryParams?.search) {
      params.search = queryParams.search;
    }
    if (queryParams?.status) {
      params.status = queryParams.status;
    }
    const response = await api.get(ADMIN_ROUTES.GET_PROGRAMS, { params });
    return response.data;
  },
  addProgram: async (program: Partial<FitnessData>) => {
    const response = await api.post(ADMIN_ROUTES.ADD_PROGRAM, program);
    return response.data;
  },
  toggleProgramStatus: async (id: string) => {
    const response = await api.patch(
      ADMIN_ROUTES.TOGGLE_PROGRAM_STATUS + '/' + id
    );
    return response.data;
  },
  updateProgram: async (program: FitnessData) => {
    const id = program.id;
    const response = await api.put(ADMIN_ROUTES.UPDATE_PROGRAM + id, program);
    return response.data;
  },
  deleteProgram: async (id: string) => {
    const response = await api.delete(ADMIN_ROUTES.DELETE_PROGRAM + '/' + id);
    return response.data;
  },
};
