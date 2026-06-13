

import type { UserBookedSessionsResponseData } from '../../types/user.booking.types';

import { useNavigate } from 'react-router-dom';

interface Props {
  nextSession: UserBookedSessionsResponseData;
}
const NextSessionCard = ({ nextSession }: Props) => {
  const navigate=useNavigate();
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-[#1e1e1e] to-[#121212] border border-emerald-500/20 rounded-3xl p-5 shadow-2xl group">
      {/* Background Decorative Accent */}
      {/* <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" /> */}
      {nextSession && (
        <div className="space-y-1"
         onClick={() => navigate('/user/my-sessions')}>
          <div className="flex items-center w-fit justify-start gap-2 px-1 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next Session
          </div>

          <h2 className="text-2xl md:text-xl font-black text-white leading-tight">
            {nextSession.sessionName}
          </h2>
        </div>
      )}
    </div>
  );
};

export default NextSessionCard;
