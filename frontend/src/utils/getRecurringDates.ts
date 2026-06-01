import type { ISlots } from '@/features/session/store/session.types';

import { addWeeks } from 'date-fns';

export const getRecurringDates = (date: Date, slot: ISlots, count: number) => {
  const dates = [
    {
      date: date.toString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotId: slot._id,
    },
  ];
  for (let i = 1; i < count; i++) {
    dates.push({
      date: addWeeks(date, i).toString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotId: slot._id!,
    });
  }

  return dates;
};
