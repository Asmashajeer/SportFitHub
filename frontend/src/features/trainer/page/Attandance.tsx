import { useEffect, useMemo, useState } from 'react';
import { useTrainerStore } from '../store/useTrainerStore';
import { PAGINATION_DEFAULT_LIMIT, PAYLOAD_MODEL, SESSION_TYPE } from '@/constants/constants';
import type { SessionOccuranceResponseData } from '../types/trainer.bookings.types';
import { AttendanceModal } from '../component/attendance/AttendanceModel';
import { trainerAttendanceService } from '../service/trainer.attendance.service';
import { formatDateDDMMYY, formatTo12Hour } from '@/utils/formatDate';
import { AttendanceDisplayModal } from '../component/attendance/AttendanceDisplayModal';
import Pagination from '@/components/reusable/Pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const Attendance = () => {
  const { profile } = useTrainerStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    sessionModel: '',
    attendanceMarked: false,
    date: '',
  });
  const [sessions, setSessions] = useState<SessionOccuranceResponseData[] | []>([]);

  const [activeSession, setActiveSession] = useState<SessionOccuranceResponseData | null>(null);

  useEffect(() => {
    if (!profile) return;
    const getBookedSessions = async () => {
      setLoading(true);
      if (profile) {
        try {
          const data = await trainerAttendanceService.getSessionOccurance(profile.id, filters);
          setSessions(data);
          setLoading(false);
        } catch (error) {
          setSessions([]);
          setLoading(false);
        }
      }
    };
    getBookedSessions();
  }, [filters, profile, activeSession]);

  // pagination
  const totalPages = Math.ceil(sessions.length / PAGINATION_DEFAULT_LIMIT);
  const currentSessions = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_DEFAULT_LIMIT;
    return sessions.slice(start, start + PAGINATION_DEFAULT_LIMIT);
  }, [sessions, currentPage]);

  const activeSessionNeedsMarking = activeSession?.participants.some((p) => p.attendance === null) ?? false;

  return (
    <div className="bg-card min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Attendance</h1>
        <p className="text-sm text-zinc-500 mt-1">Mark Attendance of participants in booked sessions</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() =>
            setFilters({
              sessionModel: '',
              attendanceMarked: false,
              date: '',
            })
          }
          className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
            filters.sessionModel === '' ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
          }`}
        >
          All
        </button>
        {Object.values(PAYLOAD_MODEL).map((p) => (
          <button
            key={p}
            onClick={() => setFilters({ ...filters, sessionModel: p })}
            className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
              filters.sessionModel === p ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setFilters({ ...filters, attendanceMarked: true })}
          className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
            filters.attendanceMarked === true ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
          }`}
        >
          marked Sessions
        </button>
       
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors">
              <CalendarIcon className="w-3 h-3" />
              {filters.date ? format(filters.date ,'yyyy-MM-dd'): 'Pick a date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.date ? new Date(filters.date) : new Date()}
              onSelect={(d) => {
                setFilters((prev) => ({
                  ...prev,
                  date: d ? format(d, 'yyyy-MM-dd')  : '',
                }));
              }}
              disabled={(d) => d > new Date(new Date().setHours(0, 0, 0, 0))} // disable future dates
            />
          </PopoverContent>
        </Popover>

        {/* Clear button */}
        {filters.date && (
          <button onClick={() => setFilters({ ...filters, date: '' })} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions?.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentSessions?.map((session) => {
            const shouldMarkAttendace = session.participants.some((p) => p.attendance === null);

            return (
              <div key={`${session.sessionId}_${session.slotId}`} className="flex items-center sm:text-xs md:text-sm  justify-between px-4 py-3 border-[0.5px] border-border rounded-lg">
                <div className="text-left ">
                  <p>{session.sessionName}</p>
                </div>
                <div>
                  <p className="m-0 font-medium text-green-800">
                    {session.sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? PAYLOAD_MODEL.SPORT_SESSION : PAYLOAD_MODEL.FITNESS_SESSION}
                    {session.sessionType === SESSION_TYPE.GROUP ? ` · ${session.participants.length} participants` : ' · 1 :1'}
                  </p>
                  <p className="m-0 text-xs  text-gray-400">
                    {new Date(session.date).toLocaleDateString()} · {formatTo12Hour(session.startTime)} - {formatTo12Hour(session.endTime)}
                  </p>
                </div>
                {shouldMarkAttendace ? (
                  <button className="hover:text-green-600 cursor-pointer" onClick={() => setActiveSession(session)}>
                    Mark Attendance
                  </button>
                ) : (
                  <button className="hover:text-green-600 cursor-pointer" onClick={() => setActiveSession(session)}>
                    show{' '}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination totalPages={totalPages} ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT} currentPage={currentPage} totalCount={sessions.length} setCurrentPage={setCurrentPage} label="Sessions" />

      {activeSession && activeSessionNeedsMarking ? (
        <AttendanceModal session={activeSession} onClose={() => setActiveSession(null)} />
      ) : (
        activeSession && <AttendanceDisplayModal session={activeSession} onClose={() => setActiveSession(null)} />
      )}
    </div>
  );
};
export default Attendance;
