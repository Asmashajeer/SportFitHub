import { create } from 'zustand';
import type { Payload } from './payment.types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
export interface BookingState {
  payload: Payload | null;
  setPayload: (payload: Payload) => void;
  clearPayload: () => void;
}
export const useBookingStore = create<BookingState>()(
  devtools(
    persist(
      (set) => ({
        payload: null,

        setPayload: (payload) => set({ payload }),
        clearPayload: () => set({ payload: null }),
      }),
      {
        name: 'sportfit-booking-payload',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
