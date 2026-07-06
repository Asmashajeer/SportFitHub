import { formatDateDDMMYY } from '@/utils/formatDate';
import { BOOKING_STATUS } from '@/constants/constants';
import type {
  UserBookedSessionsResponseData,

  UserBookingResponseDatawithStatusCount,
} from '../../types/user.booking.types';

import { useNavigate } from 'react-router-dom';

function BookingCard({
  booking,
  bookedSession,
}: {
  booking: UserBookingResponseDatawithStatusCount;
  bookedSession: UserBookedSessionsResponseData | undefined;
}) {
  const navigate = useNavigate();
  const isMultiple = booking.pricePlan.totalSessions > 1;
  const isActive = booking.status === BOOKING_STATUS.CONFIRMED;
  const statusBadge: Record<string, string> = {
    confirmed: 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    completed: 'bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20',
  };
  if(bookedSession===undefined){
    return (
      <div>No Sessions</div>
    )
  }
  return (
    <div className="bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-4 transition-all duration-200">
      {/* Booking ID */}
      <p className="text-xs text-left font-mono text-zinc-500 mb-3">
        B.ID: {booking.bookingUId} - {booking.sessionModel}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 mb-4 ">
        <div>
          <p className=" text-zinc-500 mb-1 text-xs">Session</p>
          <p className="text-xs font-normal text-zinc-100">
            {bookedSession?.session.sessionName || ''}
          </p>
          <span className="mt-1 inline-block text-xs text-zinc-400 bg-zinc-700/50 px-2 py-0.5 rounded-full">
            {bookedSession?.session.sessionType}
          </span>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Plan</p>
          <p className="text-sm text-zinc-100">
            {booking.pricePlan.totalSessions}{' '}
            {isMultiple ? 'sessions' : 'session'}
          </p>
          <p className="text-xs text-zinc-400 mt-2 mb-1">Amount paid</p>
          <p className="text-sm font-medium text-emerald-400">
            ₹ {booking.pricePlan.pricePaid}
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Venue</p>
          <p className="text-sm text-zinc-100">{booking.venue.name}</p>
          <p className="text-xs text-zinc-400 mt-1">{booking.venue.address}</p>
        </div>

        <div>
          <p className="text-xs text-zinc-400 mb-1">Booked on</p>
          <p className="text-xs text-zinc-300">
            {formatDateDDMMYY(booking.createdAt)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-700/40">
        <div className="flex gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400">
            {isMultiple ? 'Multiple sessions' : 'Single session'}
          </span>
          {/* <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[booking.status] ?? 'bg-zinc-700/50 text-zinc-400'}`}
          >
            {isActive ? 'Active' : booking.status}           
          </span> */}
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400"> Sessions :{booking.pricePlan.totalSessions}</span>
          {booking.scheduledCount> 0 &&<span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400"> Scheduled :{booking.scheduledCount}</span>}
          {booking.cancelledCount> 0 &&<span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400"> cancelled :{booking.cancelledCount}</span>}
          {booking.completedCount> 0 &&<span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400"> completed :{booking.completedCount}</span>}
        </div>
        <button
          onClick={() =>
            navigate('/user/my-sessions', { state: { bookingId: booking.id } })
          }
          className="text-xs px-3 py-1.5 rounded-lg border border-emerald-600 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
        >
          View sessions →
        </button>
      </div>
    </div>
  );
}
export default BookingCard;
