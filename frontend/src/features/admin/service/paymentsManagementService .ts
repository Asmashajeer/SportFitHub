import api from "@/api/axiosInstance";
import { ADMIN_ROUTES } from "./admin.api";
import type { BookingFilter } from "../store/types/booking.types";

export const  PaymentsManagementService = {


  getPayments:async () => {
    const res = await api.get(ADMIN_ROUTES.GET_PAYMENTS , );
    return res.data;
  },
}