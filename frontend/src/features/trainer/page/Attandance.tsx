import { useEffect, useMemo, useState } from 'react';
import { useTrainerStore } from '../store/useTrainerStore';
import { PAGINATION_DEFAULT_LIMIT, PAYLOAD_MODEL, SESSION_TYPE } from '@/constants/constants';
import type { SessionOccuranceResponseData } from '../types/trainer.bookings.types';
import { AttendanceModal } from '../component/attendance/AttendanceModel';
import { trainerAttendanceService } from '../service/trainer.attendance.service';
import { formatTo12Hour } from '@/utils/formatDate';
import { AttendanceDisplayModal } from '../component/attendance/AttendanceDisplayModal';
import Pagination from '@/components/reusable/Pagination';

const Attendance = () => {
  const { profile } = useTrainerStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    sessionModel: '',
    attendanceMarked: false,
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
              <div
                key={`${session.sessionId}_${session.slotId}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: '0.5px solid var(--border)',
                  borderRadius: 8,
                }}
              >
                <div>
                  <p>{session.sessionName}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {session.sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? PAYLOAD_MODEL.SPORT_SESSION : PAYLOAD_MODEL.FITNESS_SESSION}
                    {session.sessionType === SESSION_TYPE.GROUP ? ` · ${session.participants.length} participants` : ' · 1 :1'}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {new Date(session.date).toLocaleDateString()} · {formatTo12Hour(session.startTime)} - {formatTo12Hour(session.endTime)}
                  </p>
                </div>
                {shouldMarkAttendace ? <button onClick={() => setActiveSession(session)}>Mark Attendance</button> : <button onClick={() => setActiveSession(session)}>show Attendance</button>}
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
