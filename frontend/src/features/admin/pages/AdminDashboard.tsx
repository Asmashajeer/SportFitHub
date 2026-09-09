import  { useEffect, useState } from 'react';
import { Users, ShieldCheck, Ticket,  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, } from 'recharts';
import { DashboardService } from '../service/dashboardService';
import { CURRENCY } from '@/constants/constants';

import type { BookingDataMetric, DashboardStats, RecentBookingData, RevenuePoint } from '../store/types/dashboard.types';



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

  const startDate=new Date();
  startDate.setDate(startDate.getDate() - 7);
  const  endDate=new Date();

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [stats, revenue, metrics, recentBookings,] =
        await Promise.all([
          DashboardService.getDashboardStats(),
          DashboardService.getWeeklyRevenue(), 
          DashboardService.getBookingDataMetrics({startDate,endDate}),        
          DashboardService.getRecentBookings(),      
        ]);

      setStatsData(stats);
      setRevenueData(revenue);   
      setBookingMetrics(metrics);
      setRecentBookings(recentBookings);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
    }
  };

  fetchDashboardData();
}, []);

  const stats = [
    {
      label: 'Total Users',
      value: statsData ? statsData.totalUsers.toLocaleString() : '—',
      up: true,
      icon: Users,
      accent: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Active Trainers',
      value: statsData ? statsData.activeTrainers.toLocaleString() : '—',
      up: true,
      icon: ShieldCheck,
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Sessions',
      value: statsData ? statsData.totalSessions.toLocaleString() : '—',
      up: false,
      icon: Ticket,
      accent: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Revenue',
      value: statsData ? `${CURRENCY} ${statsData.revenue.toLocaleString()}` : '—',
      up: true,
      icon: Wallet,
      accent: 'bg-rose-50 text-rose-600',
    },
  ];

  
  return (
    <div className="min-h-screen bg-zinc-750 text-slate-500">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back — here's what's happening today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, up, icon: Icon, accent }) => (
            <div key={label} className="rounded-2xl border border-slate-500 bg-zinc-800 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className={`bg-zinc-600 rounded-xl p-2.5 ${accent}`}>
                  <Icon className="h-5 w-5 bg-zinc-600" strokeWidth={2} />
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                </span>
              </div>
              <p className="mt-4 text-2xl text-slate-300 font-semibold">{value}</p>
              <p className="text-sm text-slate-300">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-500 bg-zinc-750 p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-400">Revenue this week</h2>
                <p className="text-xs text-slate-500">Payments collected, daily</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-390 px-2.5 py-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                +8.6%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-sm font-semibold text-slate-800">Bookings by category</h2>
            <p className="mb-4 text-xs text-slate-500">This month</p>
            <ResponsiveContainer width="100%" height={220}>
             
              <BarChart data={bookingMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent bookings table */}
        <div className="mt-6 rounded-2xl border border-slate-500 bg-zinc-750 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-500 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-400">Recent bookings</h2>
            <button className="text-xs font-medium text-green-600 hover:text-green-700">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">Booking</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Trainer</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-t border-slate-400 hover:bg-slate-600">
                    <td className="px-5 py-3 font-medium text-slate-400">{b.bookingUID}</td>
                    <td className="px-5 py-3 text-slate-500">{b.user}</td>
                    <td className="px-5 py-3 text-slate-500">{b.trainer}</td>
                    <td className="px-5 py-3 text-slate-500">{b.session}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle[b.status]} }`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-slate-400">{b.amount.toFixed(2)}</td>
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
