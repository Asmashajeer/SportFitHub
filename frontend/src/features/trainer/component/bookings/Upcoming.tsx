import { useEffect, useMemo, useState } from 'react';
import { useTrainerStore } from '../../store/useTrainerStore';

import {
  BOOKING_SESSION_STATUS,
  PAGINATION_DEFAULT_LIMIT,
  PAYLOAD_MODEL,
} from '@/constants/constants';
import type { BookedSessionResponseDataWithUserInfo } from '../../types/trainer.bookings.types';
import { trainerBookingsService } from '../../service/trainer.bookings.service';
import Pagination from '@/components/reusable/Pagination';
import BookingSessionCard from './BookingSessionCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface SessionsDataProps {
  sessions: BookedSessionResponseDataWithUserInfo[] | [];
  totalPages: number;
  total: number;
  page: number;
}



const Upcoming = () => {
  const { profile } = useTrainerStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sessionModel: '',
    date: '',
    status: BOOKING_SESSION_STATUS.SCHEDULED,
  });
  const [sessionsData, setSessionsData] = useState<SessionsDataProps>({
    sessions: [],
    totalPages: 0,
    total: 0,
    page: 1,
  });
  // const [sessions,setSessions]=useState<BookedSessionResponseDataWithUserInfo|null>();

  useEffect(() => {
    if (!profile) return;
    const getBookedSessions = async () => {
      if (profile) {
        const data = await trainerBookingsService.getBookings(profile.id, {
          page: currentPage,
          limit: PAGINATION_DEFAULT_LIMIT,
          ...filters,
        });
        
        setSessionsData(data);
        setCurrentPage(sessionsData.page);
      }
    };
    getBookedSessions();
  }, [currentPage, filters, profile]);

  // grouping sessions by sessionId
  const groupedSessions = useMemo(() => {
    const sessionMap = new Map<
      string,
      BookedSessionResponseDataWithUserInfo[]
    >();
    sessionsData.sessions.forEach((s) => {
      const key = `${s.sessionId}-${s.date}-${s.slotId}`;
      if (!sessionMap.has(key)) sessionMap.set(key, []);
      sessionMap.get(key)!.push(s);
    });
    return Array.from(sessionMap.values());
  }, [sessionsData.sessions]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() =>
            setFilters({
              sessionModel: '',
              date: '',
              status: BOOKING_SESSION_STATUS.SCHEDULED,
            })
          }
          className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
            filters.sessionModel === '' && filters.date === ''
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
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors">
              <CalendarIcon className="w-3 h-3" />
              {filters.date
                ? format(new Date(filters.date), 'dd MMM yyyy')
                : 'Pick a date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.date ? new Date(filters.date) : new Date()}
              onSelect={(d) => {
                // setDate(d);
                setFilters((prev) => ({
                  ...prev,
                  date: d ? format(d, 'yyyy-MM-dd') : '',
                }));
              }}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} // disable past dates
            />
          </PopoverContent>
        </Popover>

        {/* Clear button */}
        {filters.date && (
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, date: '' }));
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      {!sessionsData?.sessions || sessionsData.sessions.length === 0 ? (
        <div className="text-center py-16 text-zinc-600 text-sm">
          No upcoming sessions found
        </div>
      ) : (
        <>
          {groupedSessions
            .sort(
              (a, b) =>
                new Date(a[0].date).getTime() - new Date(b[0].date).getTime()
            )
            .map((group) => {             
              if(new Date(group[0].date).getTime()>=new Date().getTime())
                return(<BookingSessionCard
                  key={group[0].sessionId}
                  sessions={group}
                  type={'upcoming'}
                />)
            })}
        </>
      )}
      <Pagination
        totalPages={sessionsData.totalPages}
        ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
        currentPage={currentPage}
        totalCount={sessionsData.total}
        setCurrentPage={setCurrentPage}
        label="Sessions"
      />
    </div>
  );
};

export default Upcoming;
