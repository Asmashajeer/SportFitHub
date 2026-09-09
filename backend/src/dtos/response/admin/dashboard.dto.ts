export interface DashboardStats {
  totalUsers: number;
  activeTrainers: number;
  totalSessions: number;
  revenue: number;
}

export interface RevenuePoint {
  name: string;   //  "Aug 23"
  value: number;
}

export interface RecentBookingDTO {
    id:string;
  bookingUID: string;
  user: string;
  trainer: string;
  session: string;
  status: string;
  amount: number;
}

// export interface BookingDataMetricDTO {
//   category: string;
//   totalRevenue: number;
//   totalSessions: number;
// }
export interface BookingDataMetricDTO {
  name: string;
  value: number;
  
}