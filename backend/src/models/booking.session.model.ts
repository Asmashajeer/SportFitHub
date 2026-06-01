import { BOOKING_SESSION_STATUS, PAYLOAD_MODEL, SESSION_TYPE } from "@/constants/enums"
import mongoose, { Document, Schema, Types } from "mongoose"
import { IVenue } from "./booking.model"

export interface  IBookingSession extends Document{ 
  bookingId: Types.ObjectId,
  userId:     Types.ObjectId,
  sessionId:  Types.ObjectId,
  sessionModel:typeof PAYLOAD_MODEL[keyof typeof PAYLOAD_MODEL] , //SportsSession or FitnessSession
  slotId:string,
  date:       Date,
  startTime:  string,
  endTime:string, 
  status: BOOKING_SESSION_STATUS,
  rescheduledTo:Types.ObjectId,
  attendance: boolean,  
  cancellationReason:string,
  refundedToWallet: boolean,
  refundAmount: number, 
}
export interface IBookedSessionPopulate extends Omit<IBookingSession,'sessionId'>{
  sessionId:{
      _id:Types.ObjectId
      trainerId:Types.ObjectId,
    sessionName:string,
    sessionType:typeof SESSION_TYPE[keyof typeof SESSION_TYPE]   //ONE -TO-ONE, GROUP
    maxCapacity:number,
    bookingDeadline:number,
    cancellationWindow:number
  }
  venue:IVenue
}
// const session=
const BookingSessionSchema = new Schema({
  bookingId: { type: Types.ObjectId, ref: "Booking", required: true },
  userId:    { type: Types.ObjectId, ref: "User", required: true },
  sessionId: { type: Types.ObjectId,  refPath: "sessionModel", required: true },
  sessionModel:{ type: String, enum: Object.values(PAYLOAD_MODEL), required: true },
  slotId:    { type:String,  required: true },
  date:      { type: Date, required: true },
  startTime:  { type: String, required: true },
  endTime:{ type: String, required: true },
  status: { type: String, enum: Object.values(BOOKING_SESSION_STATUS) },
  rescheduledTo: { type: Types.ObjectId,  refPath: "BookingSession",default:null },
  attendance: { type: Boolean, default: null },  
  cancellationReason:{ type:String,default:""},
  refundedToWallet: { type: Boolean, default: false }, 
  refundAmount: { type: Number, default: 0 }
 
},{ timestamps: true });
 

BookingSessionSchema.index({ slotId: 1, date: 1 })
BookingSessionSchema.index({ bookingId: 1 })
BookingSessionSchema.index({ userId: 1, date: 1 })


export default mongoose.model<IBookingSession>("BookingSession",BookingSessionSchema);