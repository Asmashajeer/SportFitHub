import { BOOKING_SESSION_STATUS, BOOKING_STATUS, BOOKING_TYPE,  PAYLOAD_MODEL, SESSION_TYPE } from "@/constants/enums";
import {  IPricePlan, IVenue } from "@/models/booking.model";
import { UserPaymentResponseDTO } from "./payment.response.dto";

export interface UserBookingResponseDTO{  
    id:string,
    bookingUId:string
    userId: string;           
    sessionId: string;
    sessionModel:PAYLOAD_MODEL,
    stripeSessionId?: string;       
    bookingType: typeof BOOKING_TYPE[keyof typeof BOOKING_TYPE];
    pricePlan:IPricePlan,      
    venue: IVenue;    
    status: BOOKING_STATUS,
    paymentId: string;        
    updatedAt: string;
    createdAt:string
}



export interface BookingConfirmResponseDTO{
 booking:UserBookingResponseDTO,
 payment: UserPaymentResponseDTO 
}
export interface BookedSlotPublicResponseData{
  sessionId: string,       
  slotId:string,  
  date:string  ,
  startTime:string,
  endTime:string,
  status:BOOKING_SESSION_STATUS, 
}
// export interface BookedSlotPublicResponseData extends Pick<UserBookingResponseDTO,'sessionId'|'bookedSlot'|'status'>{}

export interface UserBookedSessionsResponseDTO{
     id: string;
    bookingId: string,
    userId:     string,
    sessionId:  string,
    sessionModel: typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL];
    slotId:   string,  
    date:       string,
    startTime:  string,
    endTime:string, 
    status: BOOKING_SESSION_STATUS,
    rescheduledTo:string,
    attendance: boolean,  
    cancellationReason:string,
    refundedToWallet: boolean,
    refundAmount: number,
}
export interface populatedSession{
  sessionId:string,
  trainerId:string,
  sessionName:string,
  sessionType:typeof SESSION_TYPE[keyof typeof SESSION_TYPE]
  maxCapacity:number,
  bookingDeadline:number,
  cancellationWindow:number
}


export interface UserSessionsResponseDTOwithPopulatedSession extends Omit<UserBookedSessionsResponseDTO,'sessionId'>{
 session:populatedSession
 venue:IVenue
}
export interface userInfo{
  userId:string,
  userName:string,
  userEmail:string
}
export interface BookedSessionResponseDTOWithPopulatedUser extends  Omit<UserSessionsResponseDTOwithPopulatedSession,'userId'>{
  user:userInfo
}
export interface BookedSessionTrainerResponseDTO{
  sessions:BookedSessionResponseDTOWithPopulatedUser[] ,
  total:number,
  totalPages:number,
  currentPage:number
}

export interface CancelBookedSessionResponseDTO{
  sessionBookingId:string,
  bookingId: string,
  refundAmount:number
  walletBalance: number,
  cancelledAt:string,
}
