import { useEffect, useState } from 'react';
import { Users, ShieldCheck, Ticket, Wallet, TrendingUp,  } from 'lucide-react';
import { DashboardService } from '../service/dashboardService';

import type { BookingDataMetric, DashboardStats, RecentBookingData, RevenuePoint } from '../store/types/dashboard.types';
import StatCard from '@/components/reusable/StatsCard';
import DataChart from '@/components/reusable/DataChart';
import BarChart1 from '@/components/reusable/BarChart1';

const statusStyle: Record<string, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [bookingMetrics, setBookingMetrics] = useState<BookingDataMetric[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBookingData[]>([]);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, revenue, metrics, recentBookings] = await Promise.all([
          DashboardService.getDashboardStats(),
          DashboardService.getWeeklyRevenue(),
          DashboardService.getBookingDataMetrics({ startDate, endDate }),
          DashboardService.getRecentBookings(),
        ]);

        setStatsData(stats);
        setRevenueData(revenue);
        setBookingMetrics(metrics);
        setRecentBookings(recentBookings);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: 'Total Users',
      value: statsData ? statsData.totalUsers : 0,
      up: true,
      icon: Users,
      accent: 'text-indigo-600',
    },
    {
      label: 'Active Trainers',
      value: statsData ? statsData.activeTrainers : 0,
      up: true,
      icon: ShieldCheck,
      accent: 'text-emerald-600',
    },
    {
      label: 'Sessions',
      value: statsData ? statsData.totalSessions : 0,
      up: false,
      icon: Ticket,
      accent: 'text-amber-600',
    },
    {
      label: 'Revenue',
      value: statsData ? statsData.revenue : 0,
      up: true,
      icon: Wallet,
      accent: 'text-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-100">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400">Welcome back — here's what's happening today.</p>
        </div>

        {/* Stat cards - Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              icon={Icon}
              cls={accent}
            />
          ))}
        </div>

        {/* Charts - Responsive Multi-Column Layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">          
          {/* Revenue Area Chart */}
            <div className="rounded-2xl border border-slate-700 bg-zinc-800 p-4 sm:p-5 shadow-sm lg:col-span-2">
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-300">Revenue this week</h2>
                      <p className="text-xs text-slate-400">Payments collected, daily</p>
                    </div>
                    <span className="self-start sm:self-auto flex items-center gap-1 rounded-full bg-emerald-950 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-800">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {/* +8.6% */}
                    </span>
                  </div>
                  <DataChart data={revenueData}/>
          </div>

          {/* Bookings Bar Chart */}
          <div className="rounded-2xl border border-slate-700 bg-zinc-800 p-4 sm:p-5 shadow-sm">
            <h2 className="mb-1 text-sm font-semibold text-slate-300">Bookings by category</h2>
            <p className="mb-4 text-xs text-slate-400">This month</p>
            
           <BarChart1 data={bookingMetrics}/>
          </div>
        </div>

        {/* Recent bookings table - Responsive horizontal scroll container */}
        <div className="mt-6 rounded-2xl border border-slate-700 bg-zinc-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700 px-4 sm:px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-300">Recent bookings</h2>
            <button className="text-xs font-medium text-green-500 hover:text-green-400 transition-colors">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap sm:whitespace-normal">
              <thead>
                <tr className="text-xs text-slate-400 bg-zinc-900/50">
                  <th className="px-4 sm:px-5 py-3 font-medium">Booking</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">User</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Trainer</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Category</th>
                  <th className="px-4 sm:px-5 py-3 font-medium">Status</th>
                  <th className="px-4 sm:px-5 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-750 transition-colors">
                    <td className="px-4 sm:px-5 py-3 font-medium text-slate-300">{b.bookingUID}</td>
                    <td className="px-4 sm:px-5 py-3 text-slate-400">{b.user}</td>
                    <td className="px-4 sm:px-5 py-3 text-slate-400">{b.trainer}</td>
                    <td className="px-4 sm:px-5 py-3 text-slate-400">{b.session}</td>
                    <td className="px-4 sm:px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle[b.status] || ''}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right font-medium text-slate-300">
                      {b.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}