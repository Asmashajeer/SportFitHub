import { PAYLOAD_MODEL, SESSION_TYPE } from '@/constants/enums';
import { IBookedSlot } from '@/models/booking.model';
import { IBookedSessionPopulate, IBookingSession } from '@/models/booking.session.model';
import { IUser } from '@/models/user.model';
import { Types } from 'mongoose';

export interface UserInfo extends Pick<IUser, 'id' | 'name' | 'email'> {}

export interface PayloadDTO {
  user: UserInfo;
  trainerId: string;
  sessionId: string;
  sessionType: SESSION_TYPE;
  sessionsToBook: IBookedSlot[];
  planId: string;
  numberOfSessions: number;
  amount: number;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
}

export interface CreateCheckoutSessionDTO extends PayloadDTO {
  userId: string;
  lockKeys: string[];
}
export interface CheckAvailabilityDTO {
  sessionId: string;
  date: string;
  slotId: string;
  maxCapacity: number;
  timezone: string;
}

export interface LockSlotDTO {
  userId: string;
  sessionId: string;
  date: string;
  slotId: string;
  startTime: string;
}

export interface BookedSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  date: string;
}

export interface IBookedSessionPopulateUserAndSession extends Omit<IBookedSessionPopulate, 'userId'> {
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}
export interface BookingSessionRequestfilterDTO {
  page: number;
  sessionModel: string;
  date: string;
  status: string;
  limit: number;
}
export interface IBookedSessionPopulateUser extends Omit<IBookingSession, 'userId' | 'sessionId'> {
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
  sessionId: {
    _id: Types.ObjectId;
    sessionName: string;
    sessionType: string;
  };
}
