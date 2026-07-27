import BookingService from '@/features/booking/service/bookingService';
import type {
  BookingSlot,
  RemainingSlot,
} from '@/features/booking/store/payment.types';
import { useCallback, useState } from 'react';

export function useCheckAvailability() {
  const [isChecking, setIsChecking] = useState(false);
  const checkAvailability = useCallback(    async ( slots: BookingSlot[]): Promise<{   occupiedSlots: BookingSlot[];     remainingSlots: RemainingSlot[];    }> => {
      if (!slots.length) return { occupiedSlots: [], remainingSlots: [] };
      setIsChecking(true);
      try {
        const availabilityPromises = slots.map(async (slot: BookingSlot) => {
          try {
            const { isAvailable, remainingCount } =
              await BookingService.checkSlotAvailabilty({
                sessionId: slot.sessionId,
                date: slot.date,
                slotId: slot.slotId,
                maxCapacity: slot.maxCapacity,
              });
            return { slot, isAvailable, remainingCount, error: null };
          } catch (err) {
            return { slot, isAvailable: false, remainingCount: 0, error: err }; // failed promise also takes as occupied
          }
        });
   
        const results = await Promise.allSettled(availabilityPromises);
             console.log("checkAvailability" ,results);
        const occupiedSlots: BookingSlot[] = [];
        const remainingSlots: RemainingSlot[] = [];
        console.log(results);
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (!result.value.isAvailable) {
              //not available means occupied
              occupiedSlots.push(result.value.slot);
            } else {
              remainingSlots.push({
                ...result.value.slot,
                remainingCount: result.value.remainingCount,
              });
            }
          }
        });
        return { occupiedSlots, remainingSlots };
      } catch (err) {
        console.error('Availability check failed', err);
        return { occupiedSlots: [], remainingSlots: [] };
      } finally {
        setIsChecking(false);
      }
    },
    []
  );
  return { checkAvailability, isChecking };
}
