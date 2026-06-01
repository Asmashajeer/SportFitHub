import { getTimezone } from "@/context/timezone.context";
import { format, parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const formatTo12Hour = (time24: string): string => {
  const parsed = parse(time24, 'HH:mm', new Date());
  return format(parsed, 'h:mm a'); // → "2:30 PM"
};
export const formatDateTo=(date:string)=>{
   const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return formattedDate;
}

export const toUTC_Date = (date: string, time: string): Date => {
  const timezone = getTimezone();

  const localDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  localDate.setHours(hours, minutes, 0, 0);

  //convert from user's timezone to UTC
  const utcDateTime = fromZonedTime(localDate, timezone);

  //  UTC  date only
  return new Date(Date.UTC(
    utcDateTime.getUTCFullYear(),
    utcDateTime.getUTCMonth(),
    utcDateTime.getUTCDate()
  ));
};