import { PAYLOAD_MODEL, SESSION_TYPE } from '@/constants/constants';
import type { SessionOccuranceResponseData } from '../../types/trainer.bookings.types';
import { formatTo12Hour } from '@/utils/formatDate';
import { Button } from '@/components/ui/Button';

interface AttendanceDisplayModalProps {
  session: SessionOccuranceResponseData;
  onClose: () => void;
}

const AttendanceBadge = ({ attendance }: { attendance: boolean | null }) => {
  if (attendance === null) {
    return (
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-700/40 text-zinc-400 border border-zinc-700">
        Not marked
      </span>
    );
  }
  return attendance ? (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
      Present
    </span>
  ) : (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
      Absent
    </span>
  );
};

export const AttendanceDisplayModal = ({ session, onClose }: AttendanceDisplayModalProps) => {
  const presentCount = session.participants.filter((p) => p.attendance === true).length;
  const totalCount = session.participants.length;

  return (
    <div
      className="fixed inset-0 border bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700/50 rounded-xl w-full max-w-md max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{session.sessionName}</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {session.sessionModel === PAYLOAD_MODEL.SPORT_SESSION
                  ? PAYLOAD_MODEL.SPORT_SESSION
                  : PAYLOAD_MODEL.FITNESS_SESSION}
                {session.sessionType === SESSION_TYPE.GROUP
                  ? ` · ${totalCount} participants`
                  : ' · 1:1'}
              </p>
              <p className="text-sm text-zinc-400 mt-0.5">
                {new Date(session.date).toLocaleDateString()} ·{' '}
                {formatTo12Hour(session.startTime)} - {formatTo12Hour(session.endTime)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 text-xl leading-none px-1"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {session.sessionType === SESSION_TYPE.GROUP && (
            <p className="text-xs text-zinc-500 mt-3">
              {presentCount} of {totalCount} present
            </p>
          )}
        </div>

        {/* Participant list */}
        <div className="overflow-y-auto p-5 flex flex-col gap-2">
          {session.participants.map((p) => (
            <div
              key={p.userId}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-800/30"
            >
              <div>
                <p className="text-sm font-medium text-zinc-200">{p.name}</p>
                <p className="text-xs text-green-500">{p.email}</p>
              </div>
              <AttendanceBadge attendance={p.attendance} />
            </div>
          ))}

          {totalCount === 0 && (
            <p className="text-sm text-zinc-500 text-center py-6">No participants found.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            variant='secondary'
            onClick={onClose}
            className="w-full text-sm font-medium px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-600 transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};