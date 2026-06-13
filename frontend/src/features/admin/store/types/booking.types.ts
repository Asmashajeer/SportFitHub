import type { BOOKING_SESSION_STATUS, BOOKING_STATUS,  PAYLOAD_MODEL } from "@/constants/constants";
import type {   Venue } from "@/features/session/store/session.types";

export interface BookingFilter {
  page: number;
  limit: number;
  search: string;
  status: string;
  sessionModel: string;
}

interface BookingPricePlan {
    planId:string,
    totalSessions:number,
    pricePaid:number
    unitPrice:number
}
export interface AdminBookingListData {
  bookingId: string;
  bookingUId:string;
  userId:string,
  userName: string;
  userEmail: string; 
  sessionId: string;
  trainerId:string;
  sessionName:string,
  sessionType:string
  sessionModel: typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL ]; 
  pricePlan: BookingPricePlan ;
  status: typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS ];   
  venue: Venue;
  createdAt: string;

}


export interface AdminBookingSessionData {
  bookingSessionId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: typeof BOOKING_SESSION_STATUS[keyof typeof BOOKING_SESSION_STATUS ];
  attendance: boolean;
  refundedToWallet: boolean;
  refundAmount: number;
  cancellationReason?: string;
}
export interface AdminBookingDetailData extends AdminBookingListData {
  stripeSessionId?: string;
  paymentId: string;
  sessions: AdminBookingSessionData []; // from BookingSession model
}

