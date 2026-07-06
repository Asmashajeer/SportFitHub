import { BOOKING_SESSION_STATUS, BOOKING_STATUS, PAYLOAD_MODEL } from "@/constants/enums";
import { IPricePlan, IVenue } from "@/models/booking.model";
import { PaginationResponseDTO } from "../pagination.response.dto";


export interface BookingsStatsResponseDTO{
    total: number,
    pending: number,
    completed: number,
    cancelled: number,
    confirmed: number,
}


export interface AdminBookingsResponseDTO{  
  bookingId: string;
  bookingUId:string;
  userId:string,
  userName: string;
  userEmail: string; 
  sessionId: string;
  trainerId:string;
  sessionName:string,
  sessionType:string,
  sessionModel: typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL ];  
  pricePlan: IPricePlan;
  status: typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS ];   
  venue: IVenue;
  createdAt: string;
}
export interface AdminBookingsResponseDTOwithPagination extends PaginationResponseDTO{
    bookings: AdminBookingsResponseDTO[],
   
}


// full detail admin view
export interface AdminBookingDetailDTO extends AdminBookingsResponseDTO {
  stripeSessionId?: string;
  paymentId: string;
  sessions: AdminBookingSessionDTO[]; // from BookingSession model
}

// individual session slots
export interface AdminBookingSessionDTO {
  bookingSessionId: string;
  date:string;
  startTime: string;
  endTime: string;
  status: BOOKING_SESSION_STATUS;
  attendance: boolean;
  refundedToWallet: boolean;
  refundAmount: number;
  cancellationReason?: string;
}
  export interface adminBookingSessionDTOwithUserId extends AdminBookingSessionDTO {
    userId:string;
  }