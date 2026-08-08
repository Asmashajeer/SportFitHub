// import { useEffect,} from 'react';
// import { useUserDashboardStore } from '../../store/useUserDashboardStore';

// import EmptyState from '../EmptyState';
// import MiniBookingCard from './MiniBookingCard';
// import NextSessionCard from './NextSessionCard';
// import { BOOKING_SESSION_STATUS } from '@/constants/constants';
// import { useNavigate } from 'react-router-dom';
// import { useFCMToken } from '@/hooks/useFCMToken';
// import { PendingReviewsBanner } from '@/features/review/components/user/PendingReviewsBanner';


// const Dashboard = () => {
//   const { userSessions, fetchBookings } = useUserDashboardStore();
//   const navigate = useNavigate();
//   const { initFCM } = useFCMToken();
//   useEffect(() => {
//      const init = async () => {
//         await fetchBookings();
//         await initFCM(); 
//       };
//      init();     
//   }, []);
//   const upcoming = userSessions
//     .filter(
//       (s) =>
//         new Date(s.date) >= new Date() &&
//         s.status !== BOOKING_SESSION_STATUS.RESCHEDULED &&
//         s.status !== BOOKING_SESSION_STATUS.CANCELLED
//     )
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//   //  const uniqueUpcoming = upcoming.filter((session, index, self) =>
//   //   index === self.findIndex((s) => s.sessionId === session.sessionId)
//   // );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Highlight the closest booking */}
//       <div className="lg:col-span-2">
//         {upcoming[0] ? (
//           <NextSessionCard nextSession={upcoming[0]} />
//         ) : (
//           <EmptyState />
//         )}
//           <PendingReviewsBanner />
//       </div>
    

//       {/* Side list for the rest of the week */}
//       {upcoming.length > 1 && (
//         <div className="bg-[#1a1a1a] p-6 rounded-2xl">
//           <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>

//           <div className="space-y-2">
//             {upcoming
//               .slice(0, 5)
//               .sort(
//                 (a, b) =>
//                   new Date(a.date).getTime() - new Date(b.date).getTime()
//               )
//               .map((s) => (
//                 <MiniBookingCard key={`${s.id}-${s.date}`} session={s} />
//               ))}
//           </div>
//           <button
//             className="text-xs  font-bold text-emerald-700 hover:text-emerald-100"
//             onClick={() => navigate('/user/my-sessions')}
//           >
//             My Sessions
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
// export default Dashboard;



//---------------------------------------------------------------------------------------
import { useEffect } from 'react';
import { Calendar, ArrowUpRight, Plus } from 'lucide-react';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';

import EmptyState from '../EmptyState';
import MiniBookingCard from './MiniBookingCard';
import NextSessionCard from './NextSessionCard';
import { BOOKING_SESSION_STATUS } from '@/constants/constants';
import { useNavigate } from 'react-router-dom';
import { useFCMToken } from '@/hooks/useFCMToken';
import { PendingReviewsBanner } from '@/features/review/components/user/PendingReviewsBanner';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const Dashboard = () => {
  const { userSessions, fetchBookings } = useUserDashboardStore();
  const {user}=useAuthStore();
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

  const rest = upcoming.slice(1, 4);

  // Sessions landing within the next 7 days — used for the quiet weekly stat.
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const thisWeekCount = upcoming.filter(
    (s) => new Date(s.date) <= weekFromNow
  ).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4">

       {/* Greeting */}
        <div className="m-8">
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
        </div>
      <PendingReviewsBanner />

      {upcoming[0] ? (
        <>
          {/* Hero: closest booking gets the spotlight */}
          {/* <div className="rounded-3xl bg-[#1a1a1a] border border-white/5 p-6"> */}
            {/* <div className="flex items-start justify-between mb-5">
              <p className="text-sm text-emerald-500 font-medium">Up next</p>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-emerald-500" />
              </div>
            </div> */}

            <NextSessionCard nextSession={upcoming[0]} />
            
          {/* </div> */}

          {/* Quiet weekly stat — swap in real streak data once tracked */}
          <div className="rounded-3xl bg-[#1a1a1a] border border-white/5 p-5 flex items-center justify-between">
            <p className="text-sm text-gray-400">This week</p>
            <p className="text-lg font-bold text-white">{thisWeekCount} session{thisWeekCount === 1 ? '' : 's'}</p>
          </div>
        </>
      ) : (
        <EmptyState />
      )}

      {/* Coming up — short, scannable, not a full schedule dump */}
      {rest.length > 0 && (
        <div className="rounded-3xl bg-[#1a1a1a] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Coming up</p>
            <button
              onClick={() => navigate('/user/my-sessions')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {rest.map((s) => (
              <MiniBookingCard key={`${s.id}-${s.date}`} session={s} />
            ))}
          </div>
        </div>
      )}

      {/* Always-available way to book more, styled quiet like the original EmptyState CTA */}
      <button
        onClick={() => navigate('/sports')}
        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-3 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition-all"
      >
        <Plus size={16} />
        Browse sessions
      </button>
    </div>
  );
};

export default Dashboard;