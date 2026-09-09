import api from "@/api/axiosInstance"
import { ADMIN_ROUTES } from "./admin.api"

export const DashboardService={
    getDashboardStats:async()=>{
        const res= await api.get(ADMIN_ROUTES.DASHBOARD.STATS);
        return res.data;
    },
   getWeeklyRevenue:async()=>{
        const res= await api.get(ADMIN_ROUTES.DASHBOARD.WEEKLY_REVENUE);
        return res.data;
    },
    getBookingDataMetrics:async({startDate,endDate}:{startDate?:Date,endDate?:Date})=>{
        const res= await api.get(ADMIN_ROUTES.DASHBOARD.BOOKING_METRICS,{params:{startDate,endDate}});
        return res.data;
    },
    getRecentBookings:async()=>{
        const res= await api.get(ADMIN_ROUTES.DASHBOARD.RECENT_BOOKINGS);
        return res.data;
    }
}