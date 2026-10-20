import { useState, useEffect, useMemo } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import type { ISlots, Pricing, SportsSessionDetailedPublicResponseData } from '../store/session.types';
import type { FitnessSessionDetailedPublicResponseData } from '../store/fitness.session.types';
import { addDays, format, isAfter } from 'date-fns';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { formatDateDDMMYY, formatDateReadable, formatTo12Hour } from '@/utils/formatDate';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { IBookedSlot } from '@/features/user/types/user.booking.types';
import { Label } from '@/components/ui/label';
import { getRecurringDates } from '@/utils/getRecurringDates';
import { Info, Globe, MapPin } from 'lucide-react';
import type { BookingSlot } from '@/features/booking/store/payment.types';

import { getBookableRange } from '@/utils/getBookableRange';

interface props {
  selectedDate: Date | undefined;
  selectedDates: Date[] | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  setSelectedDates: (d: Date[]) => void;
  offDays: number[];
  selectedSlot: ISlots | null;
  setSelectedSlot: (d: ISlots) => void;
  pricePlan: Pricing | null;
  session: SportsSessionDetailedPublicResponseData | FitnessSessionDetailedPublicResponseData | null;
  occupiedSlots: BookingSlot[];
  filledDates: Date[];
  unavailableDates: Date[];
  bookingSlots: IBookedSlot[];
  setBookingSlots: (slot: IBookedSlot[]) => void;
  effectiveFrom: string;
  effectiveTo: string;
  isOnline?: boolean;
  userTimezone?: string;
}

const MODE = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
} as const;

const TimeSlotPicker = ({
  selectedDate,
  setSelectedDate,
  selectedDates,
  setSelectedDates,
  selectedSlot,
  setSelectedSlot,
  pricePlan,
  offDays,
  session,
  occupiedSlots,
  filledDates,
  unavailableDates,
  bookingSlots,
  setBookingSlots,
  effectiveFrom,
  effectiveTo,
  isOnline = false,
  userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: props) => {
  const dayPickerClassNames = getDefaultClassNames();
  const [isManual, setIsManual] = useState(false);
  const range = useMemo(() => getBookableRange(effectiveFrom, effectiveTo), [effectiveFrom, effectiveTo]);

  // In weekly-repeating mode, the first date must leave room for all N weeks
  const weeklyCount = pricePlan?.sessionCount ?? 1;
  const lastSelectableDate =
    range && !isManual && weeklyCount > 1
      ? addDays(range.maxDate, -(weeklyCount - 1) * 7)
      : range?.maxDate;

  const disabledDays = range
    ? [
        { dayOfWeek: offDays },
        { before: range.minDate },
        { after: lastSelectableDate! },
        ...filledDates,
        ...unavailableDates,
      ]
    : [];

  const modifiersStyles = {
    filled: {
      color: '#696969',
      backgroundColor: '#FF0000',
      textDecoration: 'line-through',
    },
    unavailable: {
      textDecoration: 'line-through',
    },
  };

  const sessionTimezone = session?.timezone || 'UTC';

  const formatSlotTime = (timeStr: string, date?: Date): string => {
    if (!timeStr) return '';
    if (!isOnline || !date) {
      return formatTo12Hour(timeStr);
    }

    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const dateString = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

      return formatInTimeZone(new Date(dateString), userTimezone, 'hh:mm a');
    } catch {
      return formatTo12Hour(timeStr);
    }
  };

  useEffect(() => {
    if (pricePlan && pricePlan?.sessionCount > 1 && !isManual && selectedDate && selectedSlot) {
      const recurringSlots = getRecurringDates(selectedDate, selectedSlot, pricePlan?.sessionCount!);
      setBookingSlots(recurringSlots.filter((slot) => slot.slotId !== undefined) as IBookedSlot[]);
    } else if (pricePlan && pricePlan?.sessionCount > 1 && isManual && selectedDates && selectedDates.length && selectedSlot) {
      const multipleSlotes: IBookedSlot[] = [];
      const { _id, startTime, endTime } = selectedSlot;
      for (let i = 0; i < selectedDates.length && _id; i++) {
        multipleSlotes.push({
          date: format(selectedDates[i], 'yyyy-MM-dd'),
          slotId: _id,
          startTime,
          endTime,
        });
      }
      setBookingSlots(multipleSlotes);
    } else {
      setBookingSlots([]);
    }
  }, [pricePlan, isManual, selectedDate, selectedSlot, selectedDates]);

  const isSlotBookable = (slotStartTime: string) => {
    const currentDate = selectedDate ?? selectedDates?.[0];
    if (session && currentDate) {
      const now = new Date();
      const startDate = currentDate;
      const datePart = format(startDate, 'yyyy-MM-dd');
      const targetDateTime = new Date(`${datePart}T${slotStartTime}`);
      const hoursDiff = (targetDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursDiff > session?.bookingDeadline;
    }
  };

  const handleSelectDates = (newSelect: Date[]) => {
    if (!pricePlan) {
      toast.custom(
        <div className="flex items-center gap-2 text-blue-800 bg-blue-200 border p-2 rounded-lg">
          <Info />
          <span>Please select a Session and Price before time slot</span>
        </div>
      );
      return;
    }
    setSelectedDates(newSelect);
  };

  const handleSelectDate = (newSelect: Date) => {
    if (!pricePlan) {
      toast.custom(
        <div className="flex items-center gap-2 text-blue-800 bg-blue-200 border p-2 rounded-lg">
          <Info />
          <span>Please select a session and price before time slot</span>
        </div>
      );
      return;
    }
    setSelectedDate(newSelect);
  };

  const handleAutomaticSelectionMultiple = () => {
    setIsManual(false);
    setSelectedDates([]);
  };

  const handleManualSelectionMultiple = () => {
    setIsManual(true);
    setSelectedDate(undefined);
  };

  if (!range) {
    const startsLater = effectiveFrom && isAfter(new Date(effectiveFrom), new Date());
    return (
      <div className="bg-zinc-900 border rounded-2xl p-6 text-center text-zinc-400">
        {startsLater
          ? `Available from ${formatDateReadable(new Date(effectiveFrom!).toString())}`
          : 'This session is not available for booking right now.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row bg-zinc-900 border rounded-2xl p-4 lg:p-6 gap-6 w-full">
      {/* Calendar Section */}
      <div className="flex justify-center shrink-0 overflow-x-auto">
        {isManual ? (
          <DayPicker
            startMonth={range.minDate}
            endMonth={range.maxDate}
            defaultMonth={range.minDate}
            min={1}
            max={pricePlan?.sessionCount}
            animate
            mode={MODE.MULTIPLE}
            selected={selectedDates}
            onSelect={handleSelectDates}
            disabled={disabledDays}
            modifiers={{ filled: filledDates, unavailable: unavailableDates }}
            modifiersStyles={modifiersStyles}
            required={true}
            footer={
              <p className={`${!selectedDates ? 'text-sm text-amber-400 animate-pulse' : 'text-emerald-600 font-medium mt-4 text-center decoration-emerald-200 underline-offset-4'}`}>
                {selectedDates ? `Selected Dates: ${selectedDates.length} days` : 'Pick a day.'}
              </p>
            }
            classNames={{
              today: `border-1 border-emerald-500`,
              selected: `bg-emerald-500 border-emerald-500 text-white`,
              root: `${dayPickerClassNames.root} shadow-lg p-2 sm:p-5 max-w-full`,
              chevron: `${dayPickerClassNames.chevron} fill-emerald-500`,
            }}
          />
        ) : (
          <DayPicker
            startMonth={range.minDate}
            endMonth={range.maxDate}
            defaultMonth={range.minDate}
            animate
            mode={MODE.SINGLE}
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={disabledDays}
            modifiers={{ filled: filledDates, unavailable: unavailableDates }}
            modifiersStyles={modifiersStyles}
            required={true}
            footer={
              <p className={`${!selectedDate ? 'text-sm text-amber-400 animate-pulse' : 'text-emerald-600 font-medium mt-4 text-center decoration-emerald-200 underline-offset-4'}`}>
                {selectedDate ? `${formatDateReadable(selectedDate.toString())}` : 'Pick a day.'}
              </p>
            }
            classNames={{
              today: `border-1 border-emerald-500`,
              selected: `bg-emerald-500 border-emerald-500 text-white`,
              root: `${dayPickerClassNames.root} shadow-lg p-2 sm:p-5 max-w-full`,
              chevron: `${dayPickerClassNames.chevron} fill-emerald-500`,
            }}
          />
        )}
      </div>

      {/* Available Slots & Options Section */}
      <div className="w-full text-zinc-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
            <p className="text-sm font-bold text-zinc-100">Available Slots</p>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">
              {isOnline ? (
                <>
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-30 sm:max-w-none">{userTimezone}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{sessionTimezone} (Venue Time)</span>
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
            {(() => {
              const currentDate = selectedDate ?? selectedDates?.[0];
              const dayName = currentDate ? format(currentDate as Date, 'eeee') : '';
              const dayData = session?.timeSlots?.find((slot) => slot.day.toLowerCase() === dayName.toLowerCase());

              return dayData ? (
                dayData.slots.map((t: ISlots) => {
                  const isAvailable = isSlotBookable(t.startTime);
                  const isBooked = occupiedSlots.some(
                    (slot) => new Date(slot.date).toDateString() === currentDate?.toDateString() && slot.startTime === t.startTime && slot.endTime === t.endTime
                  );
                  return (
                    <Button
                      key={t._id}
                      disabled={!isAvailable || isBooked}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center h-auto sm:px-4 sm:text-xs sm:gap-2 w-full
                        ${isAvailable ? 'bg-zinc-900 border-zinc-600 text-zinc-100 hover:border-emerald-500' : 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed'}
                        ${selectedSlot?._id === t._id ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : ''}
                      `}
                      onClick={() => setSelectedSlot(t)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-xs">{formatSlotTime(t.startTime, currentDate)}</span>
                        <span className="opacity-40">-</span>
                        <span className="text-sm sm:text-xs">{formatSlotTime(t.endTime, currentDate)}</span>
                      </div>
                      {isBooked && <span className="text-[10px] mt-1 p-1 bg-red-400/70 font-medium uppercase tracking-wider rounded">Booked</span>}
                      {!isAvailable && <span className="text-[10px] mt-1 text-orange-500/70 font-medium uppercase tracking-wider">Expired</span>}
                    </Button>
                  );
                })
              ) : (
                <p className="col-span-full py-4 text-center italic text-zinc-600 bg-zinc-900/50 rounded-lg">No slots scheduled for this day.</p>
              );
            })()}
          </div>

          {selectedDate && !selectedSlot && <p className="text-xs text-amber-400 animate-pulse mt-2">Please select a slot</p>}

          {/* Multiple Sessions Option */}
          {pricePlan && pricePlan?.sessionCount > 1 && (
            <div className="mt-4 w-full text-zinc-300">
              <div className="w-full mb-3">
                <div className="p-2 border border-gray-600 rounded-xl bg-gray-500/30">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className={`flex-1 flex items-center p-2 bg-black border-2 rounded-lg cursor-pointer ${!isManual && 'border-primary'} hover:border-emerald-500 transition-colors`}>
                      <div className="bg-black p-0 m-0 w-full" onClick={handleAutomaticSelectionMultiple}>
                        <span className="block text-sm font-medium">Weekly-Repeating</span>
                        <span className="text-xs text-gray-400">
                          Book next {pricePlan.sessionCount} {selectedDate ? format(Array.isArray(selectedDate) ? selectedDate[0] : selectedDate, 'eeee') : ''}s
                        </span>
                      </div>
                    </label>

                    <label className={`flex-1 flex items-center p-2 bg-black border-2 rounded-lg cursor-pointer ${isManual && 'border-primary'} hover:border-emerald-500 transition-colors`}>
                      <div className="bg-black p-0 m-0 w-full" onClick={handleManualSelectionMultiple}>
                        <span className="block text-sm font-medium">Manually Set Dates</span>
                        <span className="text-xs text-gray-400">Pick {pricePlan.sessionCount} different dates</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Automatically selected recurring dates */}
              {bookingSlots.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-left text-xs underline">All sessions ({bookingSlots.length})</p>
                  {bookingSlots.map((slot, index) => (
                    <div key={index}>
                      <Label className="py-1 block">
                        <p className="px-2 sm:px-6 flex justify-between text-xs sm:text-sm">
                          <span>Session {index + 1}</span>
                          <span className="text-emerald-500 font-medium">{formatDateDDMMYY(slot.date)}</span>
                          {isManual && (
                            <span className="text-zinc-400">
                              {formatTo12Hour(bookingSlots[0].startTime)} - {formatTo12Hour(bookingSlots[0].endTime)}
                            </span>
                          )}
                        </p>
                      </Label>
                      <hr className="border-zinc-800 my-1" />
                    </div>
                  ))}

                  {!isManual && bookingSlots[0] && (
                    <p className="text-sm p-2">
                      Slot:{' '}
                      <span className="text-sm p-2 text-emerald-500">
                        {formatSlotTime(bookingSlots[0].startTime, new Date(bookingSlots[0].date))} - {formatSlotTime(bookingSlots[0].endTime, new Date(bookingSlots[0].date))}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;