import {
  BOOKING_SESSION_STATUS,
  BOOKING_STATUS,
  BOOKING_TYPE,
  PAYLOAD_MODEL,
  SESSION_TYPE,
} from '@/constants/constants';

export interface IVenue {
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}
export interface IBookedSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  date: string;
}
export interface IPricePlan {
  planId?: string;
  totalSessions: number;
  pricePaid: number;
  unitPrice: number;
}
export interface UserBookingResponseData {
  id: string;
  userId: string;
  sessionId: string;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  stripeSessionId?: string;
  bookingType: (typeof BOOKING_TYPE)[keyof typeof BOOKING_TYPE]; // single or multiple
  pricePlan: IPricePlan;
  venue: IVenue;
  status: (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
  paymentId: string;
  updatedAt: string;
  createdAt: string;
}

export interface UserBookedSessionsResponseData {
  id: string;
  bookingId: string;
  userId: string;
  sessionId: string;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  sessionName: string;
  sessionType: (typeof SESSION_TYPE)[keyof typeof SESSION_TYPE];
  maxCapacity: number;
  bookingDeadline: number;
  cancellationWindow: number;
  venue: IVenue;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: (typeof BOOKING_SESSION_STATUS)[keyof typeof BOOKING_SESSION_STATUS];
  rescheduledTo: string;
  attendance: boolean;
  cancellationReason: string;
  refundedToWallet: boolean;
  refundAmount: number;
}
