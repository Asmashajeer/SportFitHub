import { AGE_GROUP, DAY, GENDER, INTENSITY_LEVEL, SESSION_MODE, SESSION_TYPE } from '@/constants/enums';
import mongoose, { Document, Types } from 'mongoose';

interface IVenue {
  name: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface ITimeSlot {
  day: DAY;
  slots:{
          startTime: string; // "09:00"
          endTime: string;   // "10:00"
  }[],
}

interface IPricing {
  sessionCount: number;
  price: number;
}

export interface IFitnessSession extends Document {
   _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  fitnessCategory: Types.ObjectId;
  sessionName: string;
  slug:string;
  description: string;
  duration: number;
  ageGroup: AGE_GROUP;
  gender:GENDER,
  sessionType: SESSION_TYPE;
  maxCapacity: number;
  enrolledCount: number;
  intensityLevel: INTENSITY_LEVEL;  
  mode:SESSION_MODE,
  meetingLink?:string,
  venue?: IVenue;
  amenities: string[];
  requirements: string[];
  timeSlots: ITimeSlot[];
  pricing: IPricing[];
  cancellationPolicy: string; 
  cancellationWindow:  number,
  bookingDeadline: number;
  isActive: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  images: string[];

  rating:number,
  createdAt: Date;
  updatedAt: Date;
}

const FitnessSessionSchema = new mongoose.Schema<IFitnessSession>(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainerProfile',
      required: true,
    },
    fitnessCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'FitnessProgramModal',
      required: true,
    },

    sessionName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: { type: String, lowercase: true, trim: true },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // In minutes (e.g., 60)
      required: true,
    },
    ageGroup: {
      type: String,
      enum: AGE_GROUP,
      required: true,
    },
    sessionType: {
      type: String,
      enum: SESSION_TYPE,
      required: true,
    },

    maxCapacity: {
      type: Number,
      required: function () {
        return this.sessionType === SESSION_TYPE.GROUP;
      },
      default: 1,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    intensityLevel: { 
      type: String, 
      enum:Object.values(INTENSITY_LEVEL),
      default: INTENSITY_LEVEL.BEGINNER
    },
    mode: { 
        type: String, 
        enum: Object.values(SESSION_MODE), 
        default: SESSION_MODE.OFFLINE 
        },
        meetingLink: { 
          type: String, 
          required: function() { return this.mode === SESSION_MODE.ONLINE; } 
        },
        venue: {
          name: {
            type: String,
             required: function() { return this.mode === SESSION_MODE.OFFLINE; },
            trim: true,
          },
          address: {
            type: String,
             required: function() { return this.mode === SESSION_MODE.OFFLINE; },
          },
    
          location: {
            type: {
              type: String,
              enum: ['Point'],
               required: function() { return this.mode === SESSION_MODE.OFFLINE; },
              default: 'Point',
            },
            coordinates: {
              type: [Number], // [longitude, latitude]
              required: function() { return this.mode === SESSION_MODE.OFFLINE; },
            },
          },
         
        },
        amenities:{ type:[String],
          required: function() { return this.mode === SESSION_MODE.OFFLINE; } 
        },
        requirements: [{ type: String }],

    // 4. SCHEDULE (Weekly  slots)
    timeSlots: [
      {
        day: {
          type: String,
          enum: DAY,
        },
        slots: [
        {
          startTime: { 
            type: String, 
            required: true 
          }, // Format: "HH:mm" (24hr)
          endTime: { 
            type: String, 
            required: true 
          },   // Format: "HH:mm" (24hr)
        }
      ],
      },
    ],

    pricing: [
      {
        sessionCount: { type: Number, required: true }, // e.g., 1 session
        price: { type: Number, required: true }, // e.g., 300
      },
    ],
    cancellationPolicy: { 
    type: String, 
    default: "Full refund if cancelled at least 24 hours before the session starts. No-shows are non-refundable.",
    trim: true
    },

  // OPTIONAL: A numeric cancellation window for automated logic
    cancellationWindow: {
      type: Number,
      default: 24, // hours
    },
    bookingDeadline: { type: Number, default: 2 },
    //  ADMIN CONTROLS
    isActive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    images: [String], 
    // URLs  images 
    rating:{type:Number,default:0}
  },
 
  {
    timestamps: true,
  }
);

FitnessSessionSchema.index({ trainerId: 1 });
FitnessSessionSchema.index({ fitnessCategory: 1 });
FitnessSessionSchema.index({ 'venue.location': '2dsphere' });

export default mongoose.model<IFitnessSession>('FitnessSession', FitnessSessionSchema);
