export const toRecentBookingsDTO = (booking) => {
  return {
    id: booking._id.toString(),
    bookingUID: booking.bookingUID,
    user: booking.userId?.name || 'Unknown',
    trainer: booking.trainerId?.displayName || 'Unknown',
    session: booking.sessionId?.sessionName || 'Unknown',
    amount: booking.bookingId?.pricePlan.unitPrice,
    status: booking.status,
  };
};
