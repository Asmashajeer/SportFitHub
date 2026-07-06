import type { BOOKING_TYPE, PAYLOAD_MODEL } from '@/constants/constants';

export interface IVenueAddress {
  name: string;
  address: string;
}
export interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

export interface Payload {
  user?: UserInfo;
  sessionId: string;
  trainerId:string;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  bookingType: (typeof BOOKING_TYPE)[keyof typeof BOOKING_TYPE];
  venue: IVenueAddress;
  planId: string;
  numberOfSessions: number;
  amount: number;
  sessionsToBook: BookedSlot[];
}
export interface DisplayData {
  name: string;
  venue: IVenueAddress;
  price: number;
  sessions: number;
  bookingSlots: BookingSlot[];
}

export interface BookingSlot {
  sessionId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}
export interface RemainingSlot extends BookingSlot {
  remainingCount: number;
}
export interface BookedSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  date: string;
}
