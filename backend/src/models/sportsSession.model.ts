import { AGE_GROUP, DAY, SESSION_MODE, SESSION_TYPE } from '@/constants/enums';
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
  slots: {
    startTime: string; // "09:00"
    endTime: string; // "10:00"
  }[];
}

interface IPricing {
  sessionCount: number;
  price: number;
}

export interface ISportsSession extends Document {
  _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  sportCategory: Types.ObjectId;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: AGE_GROUP;
  sessionType: SESSION_TYPE;
  enrolledCount: number;
  maxCapacity: number;
  venue?: IVenue;
  amenities?: string[];
  timeSlots: ITimeSlot[];
  pricing: IPricing[];
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
  isActive: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  images: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const SportsSessionSchema = new mongoose.Schema<ISportsSession>(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainerProfile',
      required: true,
    },
    sportCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SportsModel',
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

    venue: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
      },

      location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    amenities: { type: [String], required: true },

    // 4. SCHEDULE (Weekly  slots)
    timeSlots: [
      {
        day: {
          type: String,
          enum: DAY,
          required: true,
        },
        slots: [
          {
            startTime: {
              type: String,
              required: true,
            }, // Format: "HH:mm" (24hr)
            endTime: {
              type: String,
              required: true,
            }, // Format: "HH:mm" (24hr)
          },
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
      default: 'Full refund if cancelled at least 24 hours before the session starts. No-shows are non-refundable.',
      trim: true,
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
    rating: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);

SportsSessionSchema.index({ trainerId: 1 });
SportsSessionSchema.index({ sportCategory: 1 });
SportsSessionSchema.index({ 'venue.location': '2dsphere' });

export default mongoose.model<ISportsSession>('SportsSession', SportsSessionSchema);
