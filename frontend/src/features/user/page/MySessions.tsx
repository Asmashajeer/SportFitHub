import {
  BOOKING_SESSION_STATUS,
  PAGINATION_DEFAULT_LIMIT,
} from '@/constants/constants';
import BookingService from '@/features/booking/service/bookingService';
import { useState, useMemo, useEffect } from 'react';
import { useUserDashboardStore } from '../store/useUserDashboardStore';
import StatCard from '../../../components/reusable/StatsCard';
import SessionCard from '../component/mySessions/SessionCard';
import { useLocation, useNavigate } from 'react-router-dom';

import type { UserBookedSessionsResponseData } from '../types/user.booking.types';
import { sessionService } from '@/features/session/service/sessionService';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SessionDetailModal from '../component/mySessions/SessionDetailModal';
import Pagination from '@/components/reusable/Pagination';
import GetMapsLink from '@/components/reusable/GetMapsLink';

interface CancelStateProps {
  isCancel: boolean;
  sessionBookingId: string | null;
  session: UserBookedSessionsResponseData | null;
  reason: string;
}

export default function MySessions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(
    location.state?.bookingId
      ? 'bookingId'
      : location.state?.bookingSessionId
        ? 'BookingSessionId'
        : 'all'
  );
  const { userSessions, fetchBookings } = useUserDashboardStore();
  const [selectedSession, setSelectedSession] =
    useState<UserBookedSessionsResponseData | null>(null);
  const [cancelState, setCancelState] = useState<CancelStateProps>({
    isCancel: false,
    sessionBookingId: null,
    session: null,
    reason: '',
  });
  const [stats, setStats] = useState({
    all: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    rescheduled: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const filters = [...Object.keys(stats)];
  useEffect(() => {
    fetchBookings();
  }, [cancelState]);

  useEffect(() => {
    const getStats = async () => {
      const count = userSessions.length;
      const scheduled = userSessions.filter(
        (s) => s.status === BOOKING_SESSION_STATUS.SCHEDULED
      ).length;
      const completed = userSessions.filter(
        (s) => s.status === BOOKING_SESSION_STATUS.COMPLETED
      ).length;
      const cancelled = userSessions.filter(
        (s) => s.status === BOOKING_SESSION_STATUS.CANCELLED
      ).length;
      const rescheduled = userSessions.filter(
        (s) => s.status === BOOKING_SESSION_STATUS.RESCHEDULED
      ).length;
      setStats({
        all: count,
        scheduled: scheduled,
        completed: completed,
        cancelled: cancelled,
        rescheduled: rescheduled,
      });
    };

    getStats();
  }, [userSessions]);

  const filtered = useMemo(() => {
    if (location.state?.bookingId) {
      return userSessions.filter(
        (s) => s.bookingId === location.state.bookingId
      );
    }
    if (location.state?.bookingSessionId) {
      return userSessions.filter(
        (s) => s.id === location.state.bookingSessionId
      );
    }
    return activeFilter === 'all'
      ? userSessions.filter(
          (s) => s.status !== BOOKING_SESSION_STATUS.RESCHEDULED
        )
      : userSessions.filter((s) => s.status === activeFilter);
  }, [activeFilter, userSessions]);

  //for pagination
  useEffect(() => setCurrentPage(1), [activeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGINATION_DEFAULT_LIMIT);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_DEFAULT_LIMIT;
    return filtered.slice(start, start + PAGINATION_DEFAULT_LIMIT);
  }, [filtered, currentPage]);

  const handleCancelSession = async (
    sessionBookingId: string,
    currentSession: UserBookedSessionsResponseData,
    reason: string
  ) => {
    const filter = {
      id: currentSession.sessionId,
      sessionModel: currentSession.sessionModel, //sportsSession| fitnessSession
    };
    try {
      const { session } =
        await sessionService.getSessionDetailsfiltered(filter);
      const diff =new Date(currentSession.date).getTime() - new Date().getTime();
    if (diff < session.cancellationWindow){
        toast.custom(
          ` sorry unable to cancel this session. you should cancel this booked session before  ${session.cancellationWindow} Hr`
        );
        return;
      }
     const data=await BookingService.cancelSession(sessionBookingId, reason);
     if(data){
        setCancelState({ isCancel: false, sessionBookingId: null, session: null, reason: '' });
        toast.success('Session Cancelled successfully! Amount Added to your wallet');    
        return  navigate('/user/my-sessions');
     }
     else
       toast.error('Failed to Cancel session');
    } catch (err) {
      toast.error('Failed to Cancel session');
    }
  };

  const handleAction = (sessionBookingId: string, action: string) => {
    const session = userSessions.find(
      (session) => session.id === sessionBookingId
    );

    if (!session) {
      toast.error('session not found');
      return;
    }
    switch (action) {
      case 'reschedule':
        const diff =new Date(session.date).getTime() - new Date().getTime();
        if (diff < session.cancellationWindow){
          toast.custom(
            ` sorry unable to reschedule this session. you could reschedule this booked session before  ${session.cancellationWindow} Hr`
          );
          return;
        }
        navigate(`/user/sessions/reschedule/${sessionBookingId}`, {
          state: { session }, //  passes current session data
        });
        break;

      case 'cancel':
        setCancelState({
          isCancel: true,
          sessionBookingId: sessionBookingId,
          session: session,
          reason: '',
        });
        break;
      case 'viewDetails':
        setSelectedSession(session);
        break;

      case 'directions':       
        const [lng, lat] = session.venue.location.coordinates;
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            '_blank'
        );
    return;      
      

      default:
        console.warn('Unknown action:', action);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      {/* // dialogue box to enter reason */}
      {cancelState.isCancel && cancelState.session && (
        <Dialog
          open
          onOpenChange={() =>
            setCancelState({
              isCancel: false,
              sessionBookingId: null,
              session: null,
              reason: '',
            })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reason for Cancellation</DialogTitle>
              <DialogDescription>
                Please provide a reason before cancelling the session.
              </DialogDescription>
            </DialogHeader>

            <textarea
              className="w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={4}
              placeholder="Enter cancellation reason..."
              value={cancelState.reason}
              onChange={(e) =>
                setCancelState((prev) => ({ ...prev, reason: e.target.value }))
              }
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setCancelState({
                    isCancel: false,
                    sessionBookingId: null,
                    session: null,
                    reason: '',
                  })
                }
              >
                Back
              </Button>
              <Button
                variant="destructive"
                disabled={!cancelState.reason.trim()} // prevent empty reason
                onClick={() =>
                  handleCancelSession(
                    cancelState.sessionBookingId!,
                    cancelState.session!,
                    cancelState.reason
                  )
                }
              >
                Confirm Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-1">
            My Sessions
          </h1>
          <p className="text-sm text-zinc-500">
            Track and manage all your booked sessions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          <StatCard
            label="All"
            value={userSessions.length}
            cls="text-zinc-100"
          />
          <StatCard
            label="Upcoming"
            value={stats.scheduled}
            cls="text-blue-400"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            cls="text-emerald-400"
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            cls="text-red-400"
          />
          <StatCard
            label="Rescheduled"
            value={stats.rescheduled}
            cls="text-zinc-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
                activeFilter === f
                  ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                  : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Session List */}
        <div className="flex flex-col gap-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-zinc-600 text-sm">
              No sessions found
            </div>
          ) : (
            paginated.map((session) => (
              <>
                <SessionCard
                  key={session.id}
                  session={session}
                  onAction={handleAction}
                />
                {selectedSession && (
                  <SessionDetailModal
                    userSession={selectedSession}
                    onClose={() => setSelectedSession(null)}
                  />
                )}
              </>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}

      <Pagination
        totalPages={totalPages}
        ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
        currentPage={currentPage}
        totalCount={filtered.length}
        setCurrentPage={setCurrentPage}
        label={'Sessions'}
      />
    </div>
  );
}
