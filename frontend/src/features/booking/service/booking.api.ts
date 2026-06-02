export const BOOKING_ROUTE = {
  CHECK_SLOT_AVAIL: '/booking/checkSlotAvailability',
  LOCK_SLOT: '/booking/lock-slot',
  IS_DUPLICATE_BOOKING:'/booking/check-duplicate-booking',
  CREATE_CHECKOUT_SESSION: '/booking/payment/create-checkout-session',
  CREATE_BOOKING_WITH_WALLET:'/booking/wallet/create-booking',
  GET_BOOKING_STATUS: {
    BY_STRIPE_SESSIONID: (stripeSessionId: string) =>
      `/booking/status/${stripeSessionId}`,
  },
  GET_MY_BOOKINGS: `/booking/my-bookings`,
  GET_MY_SESSIONS: `/booking/my-sessions`,

  RESCHEDULE_SESSION: {
    BY_SESSION_BOOKINGID: (sessionBookingId: string) =>
      `/booking/sessions/${sessionBookingId}/reschedule`,
  },
  CANCEL_SESSION: {
    BY_SESSION_BOOKINGID: (sessionBookingId: string) =>
      `/booking/sessions/${sessionBookingId}`,
  },
  
};

export const PAYMENT_ROUTE = {
  GET_MY_PAYMENTS: '/booking/my-payments',
  GET_PAYMENT_INVOICE: '/booking/payment/invoice',
};
