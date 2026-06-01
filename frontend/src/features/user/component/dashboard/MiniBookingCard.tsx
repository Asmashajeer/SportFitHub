import type { SportsSessionResponseData } from '@/features/session/store/session.types';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';
import type {
  UserBookedSessionsResponseData,
  UserBookingResponseData,
} from '../../types/user.booking.types';
import type { FitnessSessionResponseData } from '@/features/session/store/fitness.session.types';
import { useEffect, useState } from 'react';
import { sessionService } from '@/features/session/service/sessionService';
import { formatDateReadable } from '@/utils/formatDate';

interface Props {
  session: UserBookedSessionsResponseData;
}

const MiniBookingCard = ({ session }: Props) => {
  const { userBookings } = useUserDashboardStore();
  const [booking] = userBookings.filter(
    (booking) => booking.id === session.bookingId
  );
  const [sessionData, setSessionData] = useState<
    SportsSessionResponseData | FitnessSessionResponseData | null
  >(null);

  useEffect(() => {
    const getSessionData = async () => {
      let sessionModel = booking.sessionModel;
      let id = booking.sessionId;
      const data = await sessionService.getSessionDetailsfiltered({
        sessionModel,
        id,
      });
      setSessionData(data.session);
    };
    getSessionData();
  }, [session, booking]);
  return (
    <div className="bg-zinc-900  border rounded-xl p-1  shadow-2xl shadow-amber-700">
      <h5 className="text-white font-sans">{sessionData?.sessionName}</h5>
      <p className="text-zinc-400 text-xs">
        {formatDateReadable(session.date)}
      </p>
      <span className="text-green-500 text-xs font-mono">{session.status}</span>
    </div>
  );
};
export default MiniBookingCard;
