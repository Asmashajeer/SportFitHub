import { useEffect, useState } from 'react';

import StatCard from '@/components/reusable/StatsCard';
import { BookingsManagementService } from '../../service/bookingsManagementService';

const BookingsStats = () => {
  const [stats, setStats] = useState({
    total:0, confirmed:0, cancelled:0, revenue:0
  });

  useEffect(() => {
    const getStats = async () => {
      const bookingsStats = await BookingsManagementService.getBookingsStats();
      setStats(bookingsStats);
    };
    getStats();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatCard
        label={'Total Bookings'}
        value={stats.total}
        cls={'text-zinc-100'}
      />
      <StatCard
        label={'Confirmed'}
        value={stats.confirmed}
        cls={'text-amber-400'}
      />
      <StatCard
        label={'Cancelled'}
        value={stats.cancelled}
        cls={'text-emerald-400'}
      />
      <StatCard
        label={'Revenue'}
        value={stats.revenue}
        cls={'text-zinc-500'}
      />
    </div>
  );
};

export default BookingsStats;
