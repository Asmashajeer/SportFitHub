import { formatDateDDMMYY, formatTo12Hour } from '@/utils/formatDate';
import type { BookedSessionResponseDataWithUserInfo } from '../../types/trainer.bookings.types';
import { useState } from 'react';

interface ParticipantsProps {
  userId: string;
  userName: string;
  userEmail: string;

  status: string;
}

function BookingSessionCard({
  sessions,
  type,
}: {
  sessions: BookedSessionResponseDataWithUserInfo[];
  type: string;
}) {
  const first = sessions[0]; // use first record for session-level info
  const bookedCount = sessions.length;
  const isFull = bookedCount >= first.maxCapacity;
  const [showParticipant, setShowParticipant] = useState(false);

  const participants: ParticipantsProps[] = sessions.map((s) => ({
    userId: s.userId,
    userName: s.userName,
    userEmail: s.userEmail,
    status: s.status,
  }));
  const isAttendanceMarkable=(session:BookedSessionResponseDataWithUserInfo)=>{
    const now =new Date();
    const [endHour,endMin]=session.endTime.split(":").map(Number);
    const sessionEnd=new Date(session.date);
    sessionEnd.setHours(endHour,endMin,0,0);
    const endOfDay=new Date (first.date);
    endOfDay.setHours(23,59,59,999);

    return now >= sessionEnd && now <= endOfDay;
  }
  
  return (
    <div className="bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-4 transition-all duration-200">
      {/* Top */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-zinc-100">
              {first.sessionName}
            </span>
            <span className="text-xs text-zinc-400 bg-zinc-700/50 px-2 py-0.5 rounded-full">
              {first.sessionType}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            <span>{first.venue.name}</span>
            <span>{formatDateDDMMYY(first.date)}</span>
            <span>
              {formatTo12Hour(first.startTime)} –{' '}
              {formatTo12Hour(first.endTime)}
            </span>
          </div>
        </div>

        {/* Capacity */}
        {type === 'upcoming' && (
          <div className="text-right">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isFull
                  ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                  : 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
              }`}
            >
              {bookedCount} / {first.maxCapacity} booked
            </span>
            {/* Progress bar */}
            <div className="w-20 h-0.5 bg-zinc-700 rounded-full mt-2 ml-auto">
              <div
                className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-blue-400'}`}
                style={{ width: `${(bookedCount / first.maxCapacity) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-700/40">
        <button
          onClick={() => setShowParticipant((prev) => !prev)}
          className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
        >
          View participants
        </button>
        {/* <button className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
          Cancel session
        </button> */}
       
      </div>
      {showParticipant && participants.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-2">
          <div className=" grid grid-cols-4 text-xs text-emerald-600">
            {/* <span className="text-gray-400">user ID</span> */}
            <span className="">Name</span>
            <span className="col-span-2 ">Email</span>

            <span className="">status</span>
          </div>
          {participants.map((p) => (
            <div className=" grid grid-cols-4 gap-2  text-sm">
              {/* <span className="text-gray-400">{p.userId}</span> */}
              <span className=" text-gray-400">{p.userName}</span>
              <span className="col-span-2 text-gray-400">{p.userEmail}</span>

              <span className="text-gray-400">{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingSessionCard;
