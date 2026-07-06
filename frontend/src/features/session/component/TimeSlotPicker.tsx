import { useState, useEffect } from 'react';

import type {
  ISlots,
  Pricing,
  SportsSessionDetailedPublicResponseData,
} from '../store/session.types';
import type { FitnessSessionDetailedPublicResponseData } from '../store/fitness.session.types';
import { format } from 'date-fns';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import {
  formatDateDDMMYY,
  formatDateReadable,
  formatTo12Hour,
} from '@/utils/formatDate';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import type { IBookedSlot } from '@/features/user/types/user.booking.types';
import { Label } from '@/components/ui/label';
import { getRecurringDates } from '@/utils/getRecurringDates';
import ToastInfo from '@/components/reusable/ToastInfo';
import { Info } from 'lucide-react';
import type { BookingSlot } from '@/features/booking/store/payment.types';

interface props {
  selectedDate: Date | undefined;
  selectedDates: Date[] | undefined;
  setSelectedDate: (d: Date | undefined) => void;
  setSelectedDates: (d: Date[]) => void;
  offDays: number[];
  selectedSlot: ISlots | null;
  setSelectedSlot: (d: ISlots) => void;
  pricePlan: Pricing | null;
  session:
    | SportsSessionDetailedPublicResponseData
    | FitnessSessionDetailedPublicResponseData
    | null;
  occupiedSlots:BookingSlot[],
  filledDates: Date[];
  bookingSlots: IBookedSlot[];
  setBookingSlots: (slot: IBookedSlot[]) => void;
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
  bookingSlots,
  setBookingSlots,
}: props) => {
  const dayPickerClassNames = getDefaultClassNames();
  const [isManual, setIsManual] = useState(false);
  // const [bookingSlots,setBookingSlots]=useState<IBookedSlot[]>([])
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 2);
  // const occupiedDates = filledSlots.map((slot) => new Date(slot.date));

  const modifiersStyles = {
   filled: {
      color: '#696969', // Slate-400
      backgroundColor: '#FF0000', // Slate-100
      textDecoration: 'line-through',
    },
  };

  useEffect(() => {
    if (
      pricePlan &&
      pricePlan?.sessionCount > 1 &&
      !isManual &&
      selectedDate &&
      selectedSlot
    ) {
      const recurringSlots = getRecurringDates(
        selectedDate,
        selectedSlot,
        pricePlan?.sessionCount!
      );
      setBookingSlots(
        recurringSlots.filter(
          (slot) => slot.slotId !== undefined
        ) as IBookedSlot[]
      );
    } else if (
      pricePlan &&
      pricePlan?.sessionCount > 1 &&
      isManual &&
      selectedDates &&
      selectedDates.length &&
      selectedSlot
    ) {
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
    // check within bookingDeadline
    const currentDate = selectedDate ?? selectedDates?.[0];
    if (session && currentDate) {
      const now = new Date();
      const startDate = currentDate;
      const datePart = format(startDate, 'yyyy-MM-dd');
      const targetDateTime = new Date(`${datePart}T${slotStartTime}`);
      const hoursDiff =
        (targetDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursDiff > session?.bookingDeadline;
    }
  };

  // Manual multiple sessions
  const handleSelectDates = (newSelect: Date[]) => {
    if (!pricePlan) {
     toast.custom(<div className='flex items-center g-2 text-blue-800 bg-blue-200 border p-2 rounded-lg'><Info  /><span>Please select a Session and Price before time slot</span></div>) 
      return;
      
    }
    setSelectedDates(newSelect);
  };

  //single or  recurrrent sessions
  const handleSelectDate = (newSelect: Date) => {
    if (!pricePlan) {
      toast.custom(<div className='flex items-center g-2 text-blue-800 bg-blue-200 border p-2 rounded-lg'><Info  /><span>Please select a session and price before time slot</span></div>) 
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
 
  return (
    <>
      {/* single mode */}

      <div className="flex bg-zinc-900 border rounded-2xl p-2 gap-1 ">
        {isManual ? (
          <DayPicker
            startMonth={new Date()}
            endMonth={endDate}
            min={1}
            max={pricePlan?.sessionCount}
            animate
            mode={MODE.MULTIPLE}
            selected={selectedDates}
            onSelect={handleSelectDates}
            disabled={[
              { dayOfWeek: offDays },
              { before: tomorrow },
              ...filledDates,
            ]}
            modifiers={{ filled: filledDates }}
            modifiersStyles={modifiersStyles}
            required={true}
            footer={
              <p
                className={`${!selectedDates ? 'text-sm text-amber-400 animate-pulse' : 'text-emerald-600 font-medium mt-4 text-center decoration-emerald-200 underline-offset-4'}`}
              >
                {selectedDates
                  ? `Selected Dates: ${selectedDates.length}days`
                  : 'Pick a day.'}
              </p>
            }
            classNames={{
              today: `border-1 border-emerald-500`,
              selected: `bg-emerald-500 border-emerald-500 text-white`,
              root: `${dayPickerClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
              chevron: `${dayPickerClassNames.chevron} fill-emerald-500`,
            }}
          />
        ) : (
          <DayPicker
            startMonth={new Date()}
            endMonth={endDate}
            animate
            mode={MODE.SINGLE}
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={[
              { dayOfWeek: offDays },
              { before:tomorrow},
              ...filledDates,
            ]}
            modifiers={{ filled: filledDates }}
            modifiersStyles={modifiersStyles}
            required={true}
            footer={
              <p
                className={`${!selectedDate ? 'text-sm text-amber-400 animate-pulse' : 'text-emerald-600 font-medium mt-4 text-center decoration-emerald-200 underline-offset-4'}`}
              >
                {selectedDate
                  ? `${formatDateReadable(selectedDate.toString())}`
                  : 'Pick a day.'}
              </p>
            }
            classNames={{
              today: `border-1 border-emerald-500`,
              selected: `bg-emerald-500 border-emerald-500 text-white`,
              root: `${dayPickerClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
              chevron: `${dayPickerClassNames.chevron} fill-emerald-500`,
            }}
          />
        )}
        <div className="mt-4  w-full  text-zinc-300 ">
          <div className="flexitems-center justify-between mb-3">
            <p className="text-sm underline font-bold">Available slots</p>
          </div>
          <div className="grid grid-cols-2 gap-3 py-2">
            {(() => {
              const currentDate = selectedDate ?? selectedDates?.[0];

              const dayName = currentDate
                ? format(currentDate as Date, 'eeee')
                : '';
              const dayData = session?.timeSlots?.find(
                (slot) => slot.day.toLowerCase() === dayName.toLowerCase()
              );

              return dayData ? (
                dayData.slots.map((t: ISlots) => {
                  const isAvailable = isSlotBookable(t.startTime);
                  const isBooked=occupiedSlots.some((slot)=> new Date(slot.date).toDateString() === currentDate?.toDateString() &&slot.startTime===t.startTime&& slot.endTime===t.endTime);
                  return (
                    <Button
                      key={t._id}
                      disabled={!isAvailable||isBooked}
                      className={`p-2 rounded-l border transition-all flex flex-col items-center h-auto sm:px-4 sm:text-xs sm:gap-2 
                                ${
                                  isAvailable
                                    ? 'bg-zinc-900 border-zinc-600 text-zinc-100 hover:border-emerald-500'
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed'
                                }
                                ${selectedSlot?._id === t._id ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : ''}
                              `}
                      onClick={() => setSelectedSlot(t)}
                    >
                      <div className="flex items-center gap-1 ">
                        <span className=" text-sm sm:text-xs  ">
                          {' '}
                          {formatTo12Hour(t.startTime)}
                        </span>
                        <span className="opacity-40">-</span>
                        <span className=" text-sm sm:text-xs">
                          {formatTo12Hour(t.endTime)}
                        </span>
                      </div>
                      {isBooked && (
                        <span className="text-[10px] mt-1 p-1.5 bg-red-400/70 font-medium uppercase tracking-wider">
                          Booked
                        </span>
                      )}
                      {!isAvailable && (
                        <span className="text-[10px] mt-1 text-orange-500/70 font-medium uppercase tracking-wider">
                          Expired
                        </span>
                      )}
                    </Button>
                  );
                })
              ) : (
                <p className="col-span-full py-4 text-center italic text-zinc-600 bg-zinc-900/50 rounded-lg">
                  No slots scheduled for this day.
                </p>
              );
            })()}
            {selectedDate && !selectedSlot && (
              <p className="text-xs text-amber-400 animate-pulse">
                Please select a slot
              </p>
            )}
          </div>

          {/* multiple Sessions */}
          {pricePlan && pricePlan?.sessionCount > 1 && (
            <div className="mt-2  w-full  text-zinc-300 ">
              <div className="w-full mb-3 ">
                <div className=" p-2 border border-gray-600 rounded-xl bg-gray-500/30">
                  <div className="flex gap-1">
                    <label
                      className={`flex items-center p-1 bg-black border-2 rounded-lg cursor-pointer ${!isManual && 'border-b-primary'} hover:border-emerald-500 transition-colors `}
                    >
                      <div
                        className=" bg-black p-0 m-0  "
                        onClick={handleAutomaticSelectionMultiple}
                      >
                        <span className="t-0 block text-sm font-medium">
                          Weekly-Repeating
                        </span>
                        <span className="text-xs text-gray-500">
                          Book the next {pricePlan.sessionCount} consecutive{' '}
                          {selectedDate
                            ? format(
                                Array.isArray(selectedDate)
                                  ? selectedDate[0]
                                  : selectedDate,
                                'eeee'
                              )
                            : ''}
                          s
                        </span>
                      </div>
                    </label>

                    <label
                      className={`}flex  p-1 bg-black border-2
                             rounded-lg cursor-pointer ${isManual && 'border-b-primary'} hover:border-emerald-500 transition-colors`}
                    >
                      <div
                        className="p-0 m-0 "
                        onClick={handleManualSelectionMultiple}
                      >
                        <span className="block text-sm font-medium">
                          Manually Set Dates
                        </span>
                        <span className=" text-xs text-gray-500">
                          Pick {pricePlan.sessionCount} different dates from the
                          calendar
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {/* automatically selected recurring dates */}
              {bookingSlots.length && (
                <div>
                  <p className="text-left text-xs underline">
                    All sessions({bookingSlots.length}){' '}
                  </p>
                  {bookingSlots.map((slot, index) => (
                    <>
                      <Label className="py-1  ">
                        <p className="px-6  ">
                          session {index + 1}{' '}
                          <span className="px-6  text-emerald-600  justify-between">
                            {formatDateDDMMYY(slot.date)}
                          </span>
                          {isManual && (
                            <span>
                              {formatTo12Hour(bookingSlots[0].startTime)} -
                              {formatTo12Hour(bookingSlots[0].endTime)}
                            </span>
                          )}
                        </p>
                      </Label>
                      <hr />
                    </>
                  ))}
                  <hr />
                  {!isManual && (
                    <p className=" text-sm p-2 ">
                      Slot :{' '}
                      <span className=" text-sm p-2 text-emerald-600">
                        {formatTo12Hour(bookingSlots[0].startTime)} -
                        {formatTo12Hour(bookingSlots[0].endTime)}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimeSlotPicker;
