import { useEffect, useState } from 'react';
import { trainerUnavailabilityService } from '../service/trainer.unavailability.service';
import type { DailyAvailability, TimeSlot } from '../types/trainerprofile.types';
import { formatTo12Hour } from '@/utils/formatDate';
import type { DayOffData } from '../types/trainer.availability.exception.types';



interface Props {
  availability: {
    weeklySchedule:DailyAvailability[];
    timezone?: string;
    effectiveFrom?: string | null;
    effectiveTo?: string | null;
    
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

  const [days, setDays] = useState<DayOffData[]>([]);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullDay,setIsFullDay]=useState(false);
  const [slots, setSlots] = useState<DailyAvailability['slots']>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const load = async () => {
    const  data  = await trainerUnavailabilityService.getUnavailableDays();
    setDays(data);
    console.log("unavailableadays -",data);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    const dayIndex = new Date(`${date}T00:00:00Z`).getUTCDay();
    const allSlots = availability.weeklySchedule[dayIndex]?.slots || [];
    const existingDayOff = days.find((d) => d.date === date);
    const blockedSlots = existingDayOff?.slots || [];

     // Filter out already blocked slots
    const availableSlots = allSlots.filter(
      (s) => !blockedSlots.some((bs) => bs.startTime === s.startTime && bs.endTime === s.endTime)
    );
      
    setSlots(availableSlots);
  }, [date]);
  
  const validate = (value: string): string => {
    if (!value) return 'Select a date';
    if (value <=today) return 'Cannot select a past date';
    if (from && value < from) return 'Before your availability starts';
    if (to && value > to) return 'After your availability ends';
    const day = new Date(`${value}T00:00:00Z`).getUTCDay();
    console.log('day', day);
    if (!availability.weeklySchedule[day]?.isAvailable) return `${availability.weeklySchedule[day].day} is not one of your working days`;
    if (days.some(d => d.date === value && d.isFullDay)) return 'Already marked unavailable';   
    return '';
  };

  const handleAdd = async () => {
    const msg = validate(date);
    if (msg) return setError(msg);
  
    try {
      setLoading(true);
      setError('');   
      const payload = {
        date,   
        selectedSlot: isFullDay ? null : selectedSlot,
        isFullDay,
        reason: reason.trim() || undefined,
      };  
      console.log("av.can.payload" ,payload);
      
      await trainerUnavailabilityService.cancelAvailability(payload);     
      setDate('');
      setReason('');
      await load();// get unavailable days
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'Something went wrong');
      setError('cannot add to unavailable list now .try again');
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
    <div className="space-y-6 px-2 pb-4">
      <p className="text-xs text-zinc-400">
        Block a specific date on one of your working days. Clients won't be able to book you on it.
      </p>

      {/* Main Form Container */}
      <div className="space-y-3">
        {/* Date Picker */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Select Date</label>
          <input
            type="date"
            value={date}
            min={from && from > today ? from : today}
            max={to}
            onChange={e => { setDate(e.target.value); setError(validate(e.target.value)); }}
            className="w-full sm:w-auto rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white scheme-dark focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Conditional Options: Full Day or Slot Selection */}
        {date && !error && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 space-y-3 animate-in fade-in-50 duration-200">
            
            {/* Full Day Checkbox */}
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="fullDay"
                checked={isFullDay}
                onChange={(e) => {
                  setIsFullDay((prev)=>!prev);
                  if (e.target.checked) {
                    setSelectedSlot(null); 
                  }
                }}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-emerald-600 accent-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer"
              />
              <span className="text-xs font-medium text-zinc-200">Entire day</span>
            </label>

            {/* Slots List Section */}
            {!isFullDay && (
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Or choose specific slots to block
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {slots?.map((s: TimeSlot, index: number) => (
                    <label 
                      key={index} 
                      className={`flex items-center space-x-2.5 p-2 rounded-md border cursor-pointer transition-colors ${
                        selectedSlot === s 
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-white' 
                          : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`slot-${index}`}
                        checked={selectedSlot === s}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSlot(s);
                            setIsFullDay(false);
                          } else {
                            setSelectedSlot(null);
                          }
                        }}
                        className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 text-emerald-600 accent-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer"
                      />
                      <span className="text-xs font-medium">
                        {formatTo12Hour(s.startTime)} - {formatTo12Hour(s.endTime)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reason Input */}
        <div className="space-y-1">
          <input
            type="text"
            value={reason}
            maxLength={300}
            placeholder="Reason for absence (optional)"
            onChange={e => setReason(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleAdd}
          disabled={loading || !date}
          className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? 'Saving...' : 'Mark unavailable'}
        </button>
      </div>

      {/* Error message display */}
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

      {/* Upcoming Days Off List */}
      <div className="pt-2 border-t border-zinc-800">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upcoming days off
        </h4>
        {days.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No days off scheduled.</p>
        ) : (
          <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900/30">
            {days.map(d => (
              <li key={d.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-white">{pretty(d.date)}</p>
                  {d.slots?.map((s)=>(
                    <p>{formatTo12Hour(s.startTime)}-{formatTo12Hour(s.endTime)}</p>
                  ))}
                 
                  {d.reason && <p className="text-[11px] text-zinc-400 mt-0.5">{d.reason}</p>}
                </div>
                <button
                  onClick={() => handleRestore(d.date)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
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