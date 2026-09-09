export interface DashboardStats {
  totalUsers: number;
  activeTrainers: number;
  totalSessions: number;
  revenue: number;
}

export interface RevenuePoint {
  name: string;
  value: number;
}
// export interface BookingDataMetrics {
//   category: string;
//   totalRevenue: number;
//   totalSessions: number;
// }
export interface BookingDataMetric {
  name: string;
  value: number;
  
}
export interface RecentBookingData {
  id:string;
  bookingUID: string;
  user: string;
  trainer: string;
  session: string;
  status: string;
  amount: number ;
}