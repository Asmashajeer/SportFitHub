import { BOOKING_STATUS, BOOKING_TYPE, PAYLOAD_MODEL } from '@/constants/enums';
import mongoose, { Document, Schema, Types } from 'mongoose';
import { randomUUID } from 'crypto';

function generateBookingUId(): string {
  const short = randomUUID().split('-')[0].toUpperCase(); // e.g. "A1B2C3D4"
  return `BK-${short}`;
}

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
export interface IBooking extends Document {
  bookingUID: string;
  userId: Types.ObjectId;
  sessionId: Types.ObjectId;
  sessionModel: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL]; //SportsSession or FitnessSession
  stripeSessionId?: string;
  bookingType: BOOKING_TYPE;
  pricePlan: IPricePlan;
  venue?: IVenue;
  status: BOOKING_STATUS;
  paymentId: Types.ObjectId; // Reference to the Payment document
  createdAt: Date;
  updatedAt: Date;
}


const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: false },
    address: { type: String, required: false },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
  },
  { _id: false } 
);

const BookingSchema = new Schema(
  {
    bookingUID: {
      type: String,
      unique: true,      
      default: generateBookingUId, // ✅ Auto-generated on every new booking
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: Schema.Types.ObjectId, refPath: 'sessionModel', required: true },
    sessionModel: { type: String, enum: Object.values(PAYLOAD_MODEL), required: true },
    stripeSessionId: { type: String, unique: true, sparse: true },
    bookingType: { type: String, enum: Object.values(BOOKING_TYPE) },
    pricePlan: {
      planId: { type: String, required: true },
      totalSessions: { type: Number, required: true },
      pricePaid: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
    },
    venue: {
      type: VenueSchema,
      required: false,
      default: undefined,
    },

  
    status: { type: String, enum: Object.values(BOOKING_STATUS) },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' }, // Cross-reference
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ 'venue.location': '2dsphere' });

export default mongoose.model<IBooking>('Booking', BookingSchema);
