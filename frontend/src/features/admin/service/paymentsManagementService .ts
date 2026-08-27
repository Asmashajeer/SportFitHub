import api from "@/api/axiosInstance";
import { ADMIN_ROUTES } from "./admin.api";
import type { PaymentStatus } from "@/constants/constants";
 interface PaymentFilter{
    page: number,
    limit: number,
    search?:string
    date?: string,
    status:PaymentStatus,
    
  }
export const  PaymentsManagementService = {
  
  getOverView:async(dateRange:{ startDate:Date,endDate:Date}|{})=>{
    const res = await api.get(ADMIN_ROUTES.GET_PAYMENT_STATS ,{params:{dateRange} });
    return res.data;
  },
  getPayments:async (filter:PaymentFilter) => {
    const res = await api.get(ADMIN_ROUTES.GET_PAYMENTS ,{params:{filter} });
    return res.data;
  },
}