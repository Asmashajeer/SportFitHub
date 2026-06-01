// Converts 24-hour time  to 12-hour format

export const formatTo12Hour = (time24: string = ''): string => {
  if (!time24) return '';

  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
};

//Formats a date string into a readable format (e.g., "Sunday, April 5")

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

export const formatDateDDMMYY = (dateString: string = ''): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
