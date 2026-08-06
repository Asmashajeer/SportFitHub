// import axiosSecure from '.';

import api from '@/api/axiosInstance';
import type { BookedSlot, BookingSlot, Payload } from '../store/payment.types';
import { BOOKING_ROUTE } from './booking.api';
import { PUBLIC_ROUTE } from '@/service/public.api';
import type { IBookedSlot } from '@/features/user/types/user.booking.types';

const BookingService = {
  //------------- check slot availability
  checkSlotAvailabilty: async (
    bookingSlot: Omit<BookingSlot, 'startTime' | 'endTime'>
  ) => {
    const res = await api.get(BOOKING_ROUTE.CHECK_SLOT_AVAIL, {
      params: bookingSlot,
    });
    return res.data;
  },

  // ----------------create checkout session
  createCheckoutSession: async (payload: Payload) => {
    const { data } = await api.post(
      BOOKING_ROUTE.CREATE_CHECKOUT_SESSION,
      payload
    );
    return data;
  },
  // ----------------create checkout session
  createBookingWithWallet: async (payload: Payload) => {
    const { data } = await api.post(
      BOOKING_ROUTE.CREATE_BOOKING_WITH_WALLET,
      payload
    );
    return data;
  },
  // ---------------get booking Status
  getBookingStatus: async (stripeSessionId: string) => {
    const res = await api.get(
      BOOKING_ROUTE.GET_BOOKING_STATUS.BY_STRIPE_SESSIONID(stripeSessionId)
    );
    return res.data;
    
  },
  //------------------- get  user bookings
  getMyBookings: async () => {
    const res = await api.get(BOOKING_ROUTE.GET_MY_BOOKINGS);
    return res.data;
  },

  //--------------  get user booked sessions
  getMySessions: async () => {
    const res = await api.get(BOOKING_ROUTE.GET_MY_SESSIONS);
    return res.data;
  },

  //----------------- get booked slots of session
  getBookedSlots: async (sessionId: string) => {
    const res = await api.get(
      PUBLIC_ROUTE.GET_BOOKED_SLOTS.BY_SESSIONID(sessionId)
    );
    return res.data;
  },

  //------------ reschedule bookings
  rescheduleSession: async (sessionBookingId: string, newSlot: BookedSlot) => {
    const res = await api.put(
      BOOKING_ROUTE.RESCHEDULE_SESSION.BY_SESSION_BOOKINGID(sessionBookingId),
      { newSlot }
    );
    return res.data;
  },

  // ------------------CANCEL bookings
  cancelSession: async (sessionBookingId: string, reason: string,cancellationWindow:number) => {
    const res = await api.patch(
      BOOKING_ROUTE.CANCEL_SESSION.BY_SESSION_BOOKINGID(sessionBookingId),
      { reason,cancellationWindow }
    );
    return res.data;
  },

  isDuplicateBooking:async(sessionId:string,bookingSlots:IBookedSlot[],timezone:string)=>{
    const res= await api.post(BOOKING_ROUTE.IS_DUPLICATE_BOOKING,{sessionId,bookingSlots,timezone},);
    return res.data;

  }
};

export default BookingService;
