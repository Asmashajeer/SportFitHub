import { addDays, addMonths, startOfDay, endOfDay, max, min, isBefore } from 'date-fns';
import { MAX_ADVANCE_BOOKING_MONTHS } from '@/constants/constants';

export const getBookableRange = (
  effectiveFrom?: Date | string | null,
  effectiveTo?: Date | string | null,
  now = new Date()
) => {
  const earliest = startOfDay(addDays(now, 1)); // same "from tomorrow" rule you have now
  const windowEnd = endOfDay(addMonths(now, MAX_ADVANCE_BOOKING_MONTHS));

  const from = effectiveFrom ? startOfDay(new Date(effectiveFrom)) : earliest;
  const to = effectiveTo ? endOfDay(new Date(effectiveTo)) : windowEnd;

  const minDate = max([earliest, from]);
  const maxDate = min([windowEnd, to]);

  return isBefore(maxDate, minDate) ? null : { minDate, maxDate };
};