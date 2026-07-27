import { useEffect, useState } from 'react';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';

import EmptyState from '../EmptyState';
import MiniBookingCard from './MiniBookingCard';
import NextSessionCard from './NextSessionCard';
import { BOOKING_SESSION_STATUS } from '@/constants/constants';
import { useNavigate } from 'react-router-dom';
import { useFCMToken } from '@/hooks/useFCMToken';
import { PendingReviewsBanner } from '@/features/review/components/PendingReviewsBanner';

const Dashboard = () => {
  const { userSessions, userBookings, fetchBookings } = useUserDashboardStore();
  const navigate = useNavigate();
  const { initFCM } = useFCMToken();
  useEffect(() => {
     const init = async () => {
        await fetchBookings();
        await initFCM(); 
      };
     init();     
  }, []);
  const upcoming = userSessions
    .filter(
      (s) =>
        new Date(s.date) >= new Date() &&
        s.status !== BOOKING_SESSION_STATUS.RESCHEDULED &&
        s.status !== BOOKING_SESSION_STATUS.CANCELLED
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //  const uniqueUpcoming = upcoming.filter((session, index, self) =>
  //   index === self.findIndex((s) => s.sessionId === session.sessionId)
  // );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Highlight the closest booking */}
      <div className="lg:col-span-2">
        {upcoming[0] ? (
          <NextSessionCard nextSession={upcoming[0]} />
        ) : (
          <EmptyState />
        )}
          <PendingReviewsBanner />
      </div>
    

      {/* Side list for the rest of the week */}
      {upcoming.length > 1 && (
        <div className="bg-[#1a1a1a] p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>

          <div className="space-y-2">
            {upcoming
              .slice(1, 5)
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((s) => (
                <MiniBookingCard key={`${s.id}-${s.date}`} session={s} />
              ))}
          </div>
          <button
            className="text-xs  font-bold text-emerald-700 hover:text-emerald-100"
            onClick={() => navigate('/user/my-sessions')}
          >
            My Sessions
          </button>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
