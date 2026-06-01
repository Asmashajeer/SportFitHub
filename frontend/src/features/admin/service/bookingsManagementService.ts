import api from "@/api/axiosInstance";
import { ADMIN_ROUTES } from "./admin.api";
import type { BookingFilter } from "../store/types/booking.types";

export const  BookingsManagementService = {
  getBookingsStats:async (  ) => {
    const res = await api.get(ADMIN_ROUTES.GET_BOOKINGS_STATS );
    return res.data;
  },

  getBookings:async (params: BookingFilter  ) => {
    const res = await api.get(ADMIN_ROUTES.GET_BOOKINGS , {  params });
    return res.data;
  },
  getBookingDetail:async (id:string  ) => {
    const res = await api.get(ADMIN_ROUTES.GET_BOOKING.BY_ID(id));
    return res.data;
  },
}