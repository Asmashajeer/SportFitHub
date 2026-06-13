import api from '@/api/axiosInstance';
import { TRAINER_ROUTES } from './trainer.api';
import type { queryParamsOptions } from '../types/trainer.bookings.types';
import { PAGINATION_DEFAULT_LIMIT } from '@/constants/constants';

export const trainerBookingsService = {
  // get bookedSessions by trainer
  getBookings: async (trainerId: string, queryParams: queryParamsOptions) => {
    const params: queryParamsOptions = {
      page: queryParams.page,
      limit: PAGINATION_DEFAULT_LIMIT,
    };
    if (queryParams?.sessionModel) {
      params.sessionModel = queryParams.sessionModel;
    }
    if (queryParams?.date) {
      params.date = queryParams.date;
    }
    if (queryParams?.status) {
      params.status = queryParams.status;
    }

    const res = await api.get(TRAINER_ROUTES.GET_BOOKINGS + `/${trainerId}`, {
      params,
    });
    return res.data;
  },


   // get bookedSessions of trainer  by sessionId 
  getBookedSessionsBySessionId:async (sessionId:string)=>{
     const res = await api.get(TRAINER_ROUTES.GET_BOOKED_SESSIONS + `/${sessionId}`);
    return res.data;
  },
  
};
