import { useEffect, useState } from 'react';
import { useTrainerStore } from '../store/useTrainerStore';

import {
  BOOKING_SESSION_STATUS,
  PAGINATION_DEFAULT_LIMIT,
  PAYLOAD_MODEL,
  SESSION_TYPE,
} from '@/constants/constants';
import type {
  SessionOccuranceResponseData,
} from '../types/trainer.bookings.types';
import Pagination from '@/components/reusable/Pagination';
import { AttendanceModal } from '../component/attendance/AttendanceModel';
import { trainerAttendanceService } from '../service/trainer.attendance.service';

interface SessionsDataProps {
  sessions: SessionOccuranceResponseData[] | [];
  totalPages: number;
  total: number;
  page: number;
}
const Attendance = () => {
  const { profile } = useTrainerStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sessionModel: '',
    date:"",
    status: BOOKING_SESSION_STATUS.SCHEDULED,
  });
  const [sessionsData, setSessionsData] = useState<SessionsDataProps>({
    sessions: [],
    totalPages: 0,
    total: 0,
    page: 1,
  });
  const [activeSession, setActiveSession] =
    useState<SessionOccuranceResponseData | null>(null);

  useEffect(() => {
    if (!profile) return;
    const getBookedSessions = async () => {
      if (profile) {
        const data = await trainerAttendanceService.getSessionOccurance(
          profile.id,
          {
            page: currentPage,
            limit: PAGINATION_DEFAULT_LIMIT,
            ...filters,
          }
        );

        setSessionsData(data);
        setCurrentPage(sessionsData.page);
      }
    };
    getBookedSessions();
  }, [currentPage, filters, profile]);



  return (
    <div className="bg-card min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Attendance</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Mark Attendance of participants in booked sessions
        </p>
      </div>
      {/* <div className="rounded-xl border border-zinc-700/40 overflow-hidden"></div> */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() =>
            setFilters({
              sessionModel: '',
              date:"",
              status: BOOKING_SESSION_STATUS.SCHEDULED,
            })
          }
          className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
            filters.sessionModel === ''
              ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
              : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
          }`}
        >
          All
        </button>
        {Object.values(PAYLOAD_MODEL).map((p) => (
          <button
            key={p}
            onClick={() => setFilters({ ...filters, sessionModel: p })}
            className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
              filters.sessionModel === p
                ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessionsData?.sessions?.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sessionsData?.sessions?.map((session) => (
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
                <p style={{ margin: 0, fontWeight: 500 }}>
                  {session.sessionModel === PAYLOAD_MODEL.SPORT_SESSION
                    ? PAYLOAD_MODEL.SPORT_SESSION
                    : PAYLOAD_MODEL.FITNESS_SESSION}
                  {session.sessionType === SESSION_TYPE.GROUP
                    ? ` · ${session.participants.length} participants`
                    : ' · 1:1'}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {new Date(session.date).toLocaleDateString()} ·{' '}
                  {session.startTime} - {session.endTime}
                </p>
              </div>

              {/* {/* {isToday(session.date) ? ( */}
                        <button onClick={() => setActiveSession(session)}>Mark attendance</button>
                    {/* ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Available on session day</span>
                    )}*/}
            </div>
          ))}
        </div>
      )}

      {/* <Pagination
        totalPages={sessionsData.totalPages}
        ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
        currentPage={currentPage}
        totalCount={sessionsData.total}
        setCurrentPage={setCurrentPage}
        label="Sessions"
      /> */}

      {activeSession && (
            <AttendanceModal
            session={activeSession}
            slotId={activeSession.slotId}
            onClose={() => setActiveSession(null)}
            />
        )}
    </div>
  );
};
export default Attendance;
