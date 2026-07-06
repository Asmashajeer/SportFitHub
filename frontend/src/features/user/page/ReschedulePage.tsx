import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  RefreshCwIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { formatTo12Hour, formatDateReadable } from '@/utils/formatDate';

import type {
  ISlots,
  SportsSessionDetailedPublicResponseData,
} from '@/features/session/store/session.types';
import type {
  IBookedSlot,
  UserBookedSessionsResponseData,
} from '@/features/user/types/user.booking.types';
import { parse, getDay } from 'date-fns';
import { sessionService } from '@/features/session/service/sessionService';
import { useCheckAvailability } from '@/hooks/useCheckAvailability';
import BookingService from '@/features/booking/service/bookingService';

export default function ReschedulePage() {
  const { sessionBookingId } = useParams<{ sessionBookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Current session booking passed via router state
  const currentSession = location.state?.session as
    | UserBookedSessionsResponseData
    | undefined;

  const [session, setSession] =
    useState<SportsSessionDetailedPublicResponseData | null>(null);
  const [offDays, setOffDays] = useState<number[]>([]);
  const [filledSlots, setFilledSlots] = useState<IBookedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<ISlots | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { checkAvailability } = useCheckAvailability();
  const dayPickerClassNames = getDefaultClassNames();
   const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  // ── Fetch session data
  useEffect(() => {
    if (!currentSession?.session.sessionId) {
      toast.error('no booked sessionData');
      return;
    }
    console.log(currentSession);
    const fetchSession = async () => {
      try {
        const filter = {
          id: currentSession.session.sessionId,
          sessionModel: currentSession.sessionModel, //sportsSession| fitnessSession
        };

        const { session } =
          await sessionService.getSessionDetailsfiltered(filter);
        setSession(session);

        if (session?.timeSlots) {
          const availableDays = session.timeSlots.map((slot: any) =>
            slot.day.toLowerCase()
          );
          const off = [0, 1, 2, 3, 4, 5, 6].filter(
            (i) =>
              !availableDays
                .map((d: string) => getDay(parse(d, 'eeee', new Date())))
                .includes(i)
          );
          setOffDays(off);

          const bookings = await BookingService.getBookedSlots(
            currentSession.session.sessionId
          );
          const { occupiedSlots } = await checkAvailability({
            sessionId: session.id,
            maxCapacity: session.maxCapacity,
            ...bookings,
          });
          setFilledSlots(occupiedSlots);
        }
      } catch (err) {
        toast.error('Failed to load session data');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [currentSession?.session.sessionId]);

  // ── Slot availability check ───
  const isSlotBookable = (slotStartTime: string): boolean => {
    if (!session || !selectedDate) return false;
    const now = new Date();
    const datePart = format(selectedDate, 'yyyy-MM-dd');
    const targetDateTime = new Date(`${datePart}T${slotStartTime}`);
    const hoursDiff =
      (targetDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > (session.bookingDeadline ?? 0);
  };

  // ── Get slots for selected day
  const getSlotsForSelectedDay = () => {
    if (!selectedDate || !session?.timeSlots) return null;
    const dayName = format(selectedDate, 'eeee');
    return session.timeSlots.find(
      (slot: any) => slot.day.toLowerCase() === dayName.toLowerCase()
    );
  };

  const occupiedDates = filledSlots.map((slot) => new Date(slot.date));

  // ── Confirm reschedule
  const handleConfirm = async () => {
    if (
      !selectedDate ||
      !selectedSlot ||
      !sessionBookingId ||
      !selectedSlot._id
    ) {
      toast.error('Please select a date and time slot');
      return;
    }

    setSubmitting(true);
    console.log(selectedSlot._id);
    try {
      await BookingService.rescheduleSession(sessionBookingId, {
        slotId: selectedSlot._id.toString(),
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      toast.success('Session rescheduled successfully!');
      navigate('/user/my-sessions');
    } catch (err) {
      toast.error(err?.toString() || 'Failed to reschedule session');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCwIcon className="w-6 h-6 text-emerald-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

  const dayData = getSlotsForSelectedDay();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">
              Reschedule Session
            </h1>
            <p className="text-xs text-zinc-500">
              Pick a new date and time slot
            </p>
          </div>
        </div>

        {/* ── Current Booking Card ── */}
        {currentSession && (
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Current Booking
            </p>
            <p className="text-sm font-medium text-zinc-100">
              {currentSession.session.sessionName}{' '}
              <span className="text-xs text-gray-500">
                ({currentSession.session.sessionType})
              </span>
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDateReadable(currentSession.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5" />
                {formatTo12Hour(currentSession.startTime)} –{' '}
                {formatTo12Hour(currentSession.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs text-amber-400 bg-amber-400/10 ring-1 ring-amber-400/20 px-2.5 py-0.5 rounded-full font-medium">
                Being Rescheduled
              </span>
            </div>
          </div>
        )}

        {/* ── New Date + Slot Picker ── */}
        <div className="bg-zinc-900 border border-zinc-700/40 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-4">
            Select New Date & Time
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Calendar */}
            <DayPicker
              startMonth={new Date()}
              endMonth={endDate}
              animate
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null); // reset slot on date change
              }}
              disabled={[
                { dayOfWeek: offDays },
                { before: tomorrow  },
                ...occupiedDates,
              ]}
              modifiers={{ occupied: occupiedDates }}
              modifiersStyles={{
                occupied: {
                  color: '#696969',
                  backgroundColor: '#FF0000',
                  textDecoration: 'line-through',
                },
              }}
              required={true}
              footer={
                <p
                  className={`${!selectedDate ? 'text-sm text-amber-400 animate-pulse' : 'text-emerald-600 font-medium mt-4 text-center'}`}
                >
                  {selectedDate
                    ? formatDateReadable(selectedDate.toString())
                    : 'Pick a day.'}
                </p>
              }
              classNames={{
                today: 'border-1 border-emerald-500',
                selected: 'bg-emerald-500 border-emerald-500 text-white',
                root: `${dayPickerClassNames.root} shadow-lg p-5`,
                chevron: `${dayPickerClassNames.chevron} fill-emerald-500`,
              }}
            />

            {/* Slot Picker */}
            <div className="flex-1 space-y-3">
              <p className="text-sm underline font-bold text-zinc-300">
                Available slots
              </p>

              {!selectedDate ? (
                <p className="text-xs text-zinc-600 italic">
                  Select a date to see available slots
                </p>
              ) : !dayData ? (
                <p className="col-span-full py-4 text-center italic text-zinc-600 bg-zinc-900/50 rounded-lg text-xs">
                  No slots scheduled for this day.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {dayData.slots.map((t: ISlots) => {
                    const isAvailable = isSlotBookable(t.startTime);
                    const isSelected = selectedSlot?._id === t._id;
                    return (
                      <Button
                        key={t._id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlot(t)}
                        className={`p-2 rounded-lg border transition-all flex flex-col items-center h-auto sm:px-4 sm:text-xs sm:gap-1
                          ${
                            isAvailable
                              ? 'bg-zinc-900 border-zinc-600 text-zinc-100 hover:border-emerald-500'
                              : 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed'
                          }
                          ${isSelected ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : ''}
                        `}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-sm sm:text-xs">
                            {formatTo12Hour(t.startTime)}
                          </span>
                          <span className="opacity-40">-</span>
                          <span className="text-sm sm:text-xs">
                            {formatTo12Hour(t.endTime)}
                          </span>
                        </div>
                        {!isAvailable && (
                          <span className="text-[10px] mt-1 text-orange-500/70 font-medium uppercase tracking-wider">
                            Expired
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}

              {selectedDate && !selectedSlot && (
                <p className="text-xs text-amber-400 animate-pulse">
                  Please select a slot
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── New Booking Summary ── */}
        {selectedDate && selectedSlot && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
              New Booking
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-emerald-500" />
                {formatDateReadable(selectedDate.toString())}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5 text-emerald-500" />
                {formatTo12Hour(selectedSlot.startTime)} –{' '}
                {formatTo12Hour(selectedSlot.endTime)}
              </span>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedSlot || submitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RefreshCwIcon className="w-4 h-4 animate-spin" />
                Rescheduling...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Confirm Reschedule
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
