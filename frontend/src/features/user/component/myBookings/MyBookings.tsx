import {
  BOOKING_STATUS,
  PAGINATION_DEFAULT_LIMIT,
} from '@/constants/constants';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';
import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../../../components/reusable/StatsCard';
import BookingCard from './BookingCard';
import Pagination from '@/components/reusable/Pagination';

const MyBookings = () => {
  const { userBookings, userSessions, fetchBookings } = useUserDashboardStore();
  const filters = ['all', ...Object.values(BOOKING_STATUS)];
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    sessionsBooked: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const getSession = (bookingId: string) =>
    userSessions.find((s) => s.bookingId === bookingId);
  useEffect(() => {
    const getStats = async () => {
      const count = userBookings.length;
      const totalSpent = userBookings.reduce((sum, booking) => {
        sum += booking.pricePlan.pricePaid;
        return sum;
      }, 0);
      const sessionsBooked = userBookings.reduce((sum, booking) => {
        sum += booking.pricePlan.totalSessions;
        return sum;
      }, 0);
      setStats({
        totalBookings: count,
        totalSpent: totalSpent,
        sessionsBooked: sessionsBooked,
      });
    };
    getStats();
  }, [userBookings]);

  const filtered = useMemo(() => {
    return activeFilter === 'all'
      ? userBookings
      : userBookings.filter((b) => b.status === activeFilter);
  }, [userBookings, activeFilter]);

  //for pagination
  useEffect(() => setCurrentPage(1), [activeFilter]);
  const totalPages = Math.ceil(filtered.length / PAGINATION_DEFAULT_LIMIT);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_DEFAULT_LIMIT;
    return filtered.slice(start, start + PAGINATION_DEFAULT_LIMIT);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-1">
            My Bookings
          </h1>
          <p className="text-sm text-zinc-500">Track all your bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          <StatCard
            label="Total Bookings"
            value={userBookings.length}
            cls="text-gray-400"
          />
          <StatCard
            label="Total Spent"
            value={stats.totalSpent}
            cls="text-blue-400"
          />
          <StatCard
            label="Sessions Booked"
            value={stats.sessionsBooked}
            cls="text-emerald-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
                activeFilter === f
                  ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                  : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="flex flex-col gap-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-zinc-600 text-sm">
              No bookings found
            </div>
          ) : (
            paginated.map((booking) => (
              <>
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  bookedSession={getSession(booking.id)}
                />
              </>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
        currentPage={currentPage}
        totalCount={filtered.length}
        setCurrentPage={setCurrentPage}
        label={'Bookings'}
      />
    </div>
  );
};
export default MyBookings;
