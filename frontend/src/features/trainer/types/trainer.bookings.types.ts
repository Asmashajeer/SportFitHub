import type {
  BOOKING_SESSION_STATUS,
  PAYLOAD_MODEL,
  SESSION_TYPE,
} from '@/constants/constants';
import type { IVenue } from '@/features/user/types/user.booking.types';

export interface BookedSessionResponseDataWithUserInfo {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  trainer:{
      id:string,
      userId:string,
      trainerName:string,
    },
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
  startDateTime:string,  //utc
  endDateTime:string,  //in utc
  timezone:string,
  status: (typeof BOOKING_SESSION_STATUS)[keyof typeof BOOKING_SESSION_STATUS];
  rescheduledTo: string;
  attendance: boolean;
  cancellationReason: string;
  refundedToWallet: boolean;
  refundAmount: number;
}
export interface queryParamsOptions {
  page: number;
  limit: number;
  sessionModel?: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  date?: string;
  status?: string;
  
}
export interface queryParamsWithAttendace {
  sessionModel?: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  attendanceMarked:boolean
} 

interface participants{  
      bookingSessionId:string,
      userId:string,
      name:string,
      email:string,
      attendance:boolean
  }

export interface SessionOccuranceResponseData{
  sessionId:string,
  sessionModel: typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL];
  sessionName:string,
  sessionType:string,
  slotId: string,
  date: string,
  startTime: string,
  endTime: string,
  isbookedSessionGroup:boolean,
  participants:participants[]
}

