// ---------------Converts 24-hour time  to 12-hour format

export const formatTo12Hour = (time24: string = ''): string => {
  if (!time24) return '';

  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
};

// --------------Formats a date string into a readable format (e.g., "Sunday, April 5")

export const formatDateReadable = (dateString: string = ''): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
// --------------Formats a date string into a  format (e.g., "DD/MM/YYYY")
export const formatDateDDMMYY = (dateString: string = ''): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

//-----------Formats a date string TO Date Labels  (eg:"Today", "Yesterday", or formatted date)
export const formatDateLabel=(dateStr: string): string=> {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}