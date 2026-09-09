import { BookingDataMetricDTO, DashboardStats, RecentBookingDTO, RevenuePoint } from '@/dtos/response/admin/dashboard.dto';

export interface IDashboardService {
  getStats(): Promise<DashboardStats>;
  getWeeklyRevenue(): Promise<RevenuePoint[]>;
  getRecentBookings(): Promise<RecentBookingDTO[]>;
  getBookingCategoryMetrics(startDate?: Date, endDate?: Date): Promise<BookingDataMetricDTO[]>;
}
