import { UserSessionsResponseDTOwithPrice } from "@/dtos/response/booking/booking.response.dto";

export function groupByOccurrence(bookingSessions: UserSessionsResponseDTOwithPrice[]) {
  const map = new Map<string, { trainerId: string; slotId: string; startDateTime: Date; bookings: typeof bookingSessions }>();

  for (const b of bookingSessions) {
    const key = `${b.slotId}_${b.startDateTime}`;
    if (!map.has(key)) {
      map.set(key, { trainerId: b.trainer.id, slotId: b.slotId, startDateTime:new Date (b.startDateTime), bookings: [] });
    }
    map.get(key)!.bookings.push(b);
  }

  return Array.from(map.values());
}