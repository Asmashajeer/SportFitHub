import { useEffect, useState } from 'react';
import { SessionManagementService } from '../../service/sessionManagementService';
import StatCard from '@/components/reusable/StatsCard';

const SessionStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    inactive: 0,
    rejected: 0,
  });

  useEffect(() => {
    const getSessions = async () => {
      const { sportsStats, fitnessStats } =
        await SessionManagementService.getSessionStats();
      setStats({
        total: sportsStats.total + fitnessStats.total,
        pending: sportsStats.pending + fitnessStats.pending,
        active: sportsStats.active + fitnessStats.active,
        inactive: sportsStats.inactive + fitnessStats.inactive,
        rejected: sportsStats.rejected + fitnessStats.rejected,
      });
    };
    getSessions();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatCard
        label={'Total sessions'}
        value={stats.total}
        cls={'text-zinc-100'}
      />
      <StatCard
        label={'Pending approval'}
        value={stats.pending}
        cls={'text-amber-400'}
      />
      <StatCard
        label={'Active'}
        value={stats.active}
        cls={'text-emerald-400'}
      />
      <StatCard
        label={'Inactive'}
        value={stats.inactive}
        cls={'text-zinc-500'}
      />
    </div>
  );
};

export default SessionStats;
