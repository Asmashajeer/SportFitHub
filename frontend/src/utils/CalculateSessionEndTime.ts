export const calculateSessionEndTime = (startTime: string, duration: number): string => {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;

  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};