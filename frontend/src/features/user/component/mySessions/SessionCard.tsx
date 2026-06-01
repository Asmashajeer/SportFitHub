import { CalendarIcon, ClockIcon, PinIcon, Trash2 } from 'lucide-react';
import ActionButton from './ActionButton';
import {
  formatDateDDMMYY,
  formatDateReadable,
  formatTo12Hour,
} from '@/utils/formatDate';
import { BOOKING_SESSION_STATUS } from '@/constants/constants';
import type { UserBookedSessionsResponseData } from '../../types/user.booking.types';
import { format } from 'date-fns';
import ConfirmDialog from '@/components/reusable/ConfirmDialog';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';
import { useMemo, useState } from 'react';

const STATUS_CONFIG: Record<
  (typeof BOOKING_SESSION_STATUS)[keyof typeof BOOKING_SESSION_STATUS],
  { label: string; badge: string; dot: string; actions: string[] }
> = {
  scheduled: {
    label: 'Upcoming',
    badge: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    dot: 'bg-blue-400',
    actions: ['viewDetails', 'reschedule', 'cancel', 'directions'],
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    dot: 'bg-emerald-400',
    actions: ['viewDetails', 'bookagain', 'directions'],
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    dot: 'bg-red-400',
    actions: ['viewDetails'],
  },

  // rescheduled: {
  //   label: "",
  //   badge: "",
  //   dot: "bg-violet-400",
  //   actions: ["viewDetails","rescheduledTo"],
  // },
};
function SessionCard({
  session,
  onAction,
}: {
  session: UserBookedSessionsResponseData;
  onAction: (sessionId: string, action: string) => void;
}) {
  const { userSessions } = useUserDashboardStore();

  const baseCfg = STATUS_CONFIG[session.status] ?? {
    label: session.status,
    badge: 'bg-zinc-500/10 text-zinc-400 ring-1 ring-zinc-500/20',
    dot: 'bg-zinc-400',
    actions: [],
  };
  const cfg = {
    ...baseCfg,
    actions: [...baseCfg.actions],
  };
  const rescheduledTo = useMemo(() => {
    if (session.status !== BOOKING_SESSION_STATUS.RESCHEDULED) return null;
    return userSessions.find((s) => s.id === session.rescheduledTo) ?? null;
  }, [session, userSessions]);


  const isSlotBookable = (sessionStartTime: string): Boolean => {
    // check within bookingDeadline
    if (!session?.date) return false;
    const now = new Date();
    const startDate = new Date(session.date);
    const datePart = format(startDate, 'yyyy-MM-dd');
    const targetDateTime = new Date(`${datePart}T${sessionStartTime}`);
    const hoursDiff =
      (targetDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDiff > session.bookingDeadline;
  };
  // session reached booking deadline
  if (
    session.status === BOOKING_SESSION_STATUS.SCHEDULED &&
    !isSlotBookable(session.startTime)
  ) {
    cfg.actions = [...cfg.actions.filter((action) => action !== 'reschedule')];
  }

  return (
    <div className="group  bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-4  transition-all duration-200">
      <div className="flex flex-col gap-2">
        {/* Left — dot + info */}
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="mt-1.5 shrink-0">
            <span className={`block w-2 h-2 rounded-full ${cfg.dot}`} />
          </div>
          <div className="flex-1 pb-2 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-medium text-zinc-100">
                {session.sessionName}
              </span>
              <span className="text-xs text-zinc-400 bg-zinc-700/50 px-2 py-0.5 rounded-full">
                {session.sessionType}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mb-2">
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {formatDateDDMMYY(session.date)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon />
                {formatTo12Hour(session.startTime)} –{' '}
                {formatTo12Hour(session.endTime)}
              </span>
              <span className="flex items-center gap-1">
                <PinIcon />
                {session.venue.name}, {session.venue.address}
              </span>
            </div>
            <span className="text-xs text-zinc-700">{session.bookingId}</span>
          </div>
          <div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>
        </div>
      </div>
      {session.status === BOOKING_SESSION_STATUS.RESCHEDULED && (
        <div>
          <p className="text-sm">
            Resheduled to:{' '}
            <span className=" text-amber-300">
              {formatDateReadable(rescheduledTo?.date)} (
              {formatTo12Hour(rescheduledTo?.startTime)}-
              {formatTo12Hour(rescheduledTo?.endTime)})
            </span>{' '}
          </p>
        </div>
      )}
      {cfg.actions.length > 0 && (
        <div className="flex justify-end  gap-2">
          {cfg.actions.map((a) =>
            a === 'cancel' ? (
              <div className=" px-3 py-1 rounded-lg border border-red-400/30 hover:bg-red-500/10">
                <ConfirmDialog
                  key="cancel"
                  icon={
                    <span className="text-xs text-red-400 border-red-500/30"> Cancel </span>
                  }
                  title={`Cancel ${session.sessionName}?`}
                  description={`Are you sure you want to cancel ${session.sessionName}? The amount will be added to your wallet.`}
                  onConfirm={() => onAction(session.id, 'cancel')}
                />
              </div>
            ) : (
              <ActionButton
                key={a}
                type={a}
                onAction={(type) => onAction(session.id, type)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
export default SessionCard;
