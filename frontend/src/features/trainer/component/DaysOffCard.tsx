import { useEffect, useState } from 'react';
import { trainerUnavailabilityService } from '../service/trainer.unavailability.service';
import { DAYS_OF_WEEK } from '@/constants/constants';

interface DayOff { id: string; date: string; reason?: string }

interface Props {
  availability: {
    isAvailable: boolean;
    timezone?: string;
    effectiveFrom?: string | null;
    effectiveTo?: string | null;
    [day: string]: any; // Monday: { available, startTime, endTime } ...
  };
}

const dateInTz = (d: Date | string, tz: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date(d)); // YYYY-MM-DD

const pretty = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  });

export default function DaysOffCard({ availability }: Props) {
  const tz = availability.timezone || 'UTC';
  const today = dateInTz(new Date(), tz);
  const from = availability.effectiveFrom ? dateInTz(availability.effectiveFrom, tz) : undefined;
  const to = availability.effectiveTo ? dateInTz(availability.effectiveTo, tz) : undefined;

  const [days, setDays] = useState<DayOff[]>([]);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const  data  = await trainerUnavailabilityService.getUnavailableDays();
    setDays(data);
  };
  useEffect(() => { load(); }, []);

  
  const validate = (value: string): string => {
    if (!value) return 'Select a date';
    if (value < today) return 'Cannot select a past date';
    if (from && value < from) return 'Before your availability starts';
    if (to && value > to) return 'After your availability ends';
    const dayName = DAYS_OF_WEEK[new Date(`${value}T00:00:00Z`).getUTCDay()];
    if (!availability[dayName]?.available) return `${dayName} is not one of your working days`;
    if (days.some(d => d.date === value)) return 'Already marked unavailable';
    return '';
  };

  const handleAdd = async () => {
    const msg = validate(date);
    if (msg) return setError(msg);

    try {
      setLoading(true);
      setError('');
      await trainerUnavailabilityService.cancelAvailability({ date, reason: reason.trim() || undefined });
      setDate('');
      setReason('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (d: string) => {
    try {
      await trainerUnavailabilityService.restoreAvailability(d);
      setDays(prev => prev.filter(x => x.date !== d));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not restore this day');
    }
  };

  return (
    <div className="space-y-5 px-2 pb-4">
      <p className="text-sm text-gray-400">
        Block a specific date on one of your working days. Clients won't be able to book you on it.
      </p>

      <div className="grid gap-3 sm:grid-cols-[200px_1fr_auto]">
        <input
          type="date"
          value={date}
          min={from && from > today ? from : today}
          max={to}
          onChange={e => { setDate(e.target.value); setError(validate(e.target.value)); }}
          className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm text-white scheme-dark"
        />
        <input
          type="text"
          value={reason}
          maxLength={300}
          placeholder="Reason (optional)"
          onChange={e => setReason(e.target.value)}
          className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm text-white"
        />
        <button
          onClick={handleAdd}
          disabled={loading || !date}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Mark unavailable'}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Upcoming days off
        </h4>
        {days.length === 0 ? (
          <p className="text-sm text-gray-500">No days off scheduled.</p>
        ) : (
          <ul className="divide-y divide-gray-800 rounded-lg border border-gray-800">
            {days.map(d => (
              <li key={d.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{pretty(d.date)}</p>
                  {d.reason && <p className="text-xs text-gray-400">{d.reason}</p>}
                </div>
                <button
                  onClick={() => handleRestore(d.date)}
                  className="text-sm text-green-500 hover:underline"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}