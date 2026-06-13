import mongoose, { Document, Types } from 'mongoose';
import {

  DOC_VERIFY_STATUS,
  GENDER,
  GOVT_ID_TYPE,
  TRAINER_CATEGORY,
  TRAINER_STATUS,
} from '@/constants/enums';

interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface ICertification {
  name: string;
  url: string;
  validUpto: Date;
  issuedAt: Date;
}

interface IDayAvailability {
  available: boolean;
  startTime?: string; // 24 hr
  endTime?: string; // 24 hr ("17:00")
}

export interface ITrainerProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  // basic Info Branding
  category: TRAINER_CATEGORY;
  displayName: string;
  coreDiscipline: string;
  bio?: string;
  specialties: string[];
  experience: number;
  languages: string[];
  profilePic: string;
  pricing: {
    sessionCharge: number;    
  };

  // rating
  averageRating: number;
  ratingCount: number;

  // Personal Info
  personalInfo: {
    fullName: string;
    DOB: Date;
    gender: GENDER;
    phone: string;
    address: IAddress;
  };

  // certificates & Verification
  certificationInfo: {
    documents: ICertification[];
    verified: boolean;
    status: DOC_VERIFY_STATUS;
    verifiedAt?: Date;
    rejectReason?: string;
  };

  // id &verification
  idVerification: {
    idType: GOVT_ID_TYPE;
    idNumber: string;
    idAttachment: string;
    verified: boolean;
    status: DOC_VERIFY_STATUS;
    verifiedAt?: Date;
    rejectReason?: string;
  };

  // Location
  currentLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  // availability
  availability: {
    isAvailable: boolean;
    Monday: IDayAvailability;
    Tuesday: IDayAvailability;
    Wednesday: IDayAvailability;
    Thursday: IDayAvailability;
    Friday: IDayAvailability;
    Saturday: IDayAvailability;
    Sunday: IDayAvailability;
  };

  // payment Data
  paymentInfo: {
    bankAccount: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      ifscCode: string;
    };
    upiId?: string;
  };

  // Administrative State
  status: TRAINER_STATUS;
  suspensionReason?: string;
  suspendedAt?: Date;
  rejectionReason?: string;
  rejectedAt?: Date;
  applicationCount: number;
  penalty:number
  strikePoints:number;
  cancellationCount: number,
   lastStrikeDate?:Date
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// -------------------SCHEMA---------

const TrainerProfileSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },

    // --- Basic Branding info ---
    category: { type: String, enum: Object.values(TRAINER_CATEGORY), required: true },
    displayName: { type: String, required: true },
    coreDiscipline: { type: String, required: true },
    bio: { type: String, maxLength: 1000 },
    specialties: [{ type: String }],
    experience: { type: Number, required: true },
    languages: [{ type: String }],
    profilePic: { type: String, required: true },

    pricing: {
      sessionCharge: { type: Number, default: 0, min: 1 },     
    },
    // --- Rating ---
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v: number) => Math.round(v * 10) / 10, // Rounds to 1 decimal place (e.g., 4.7)
    },
    ratingCount: {
      type: Number,
      default: 0,
    },

    // --- Personal Info ---
    personalInfo: {
      fullName: { type: String, required: [true, 'Full Name is required'] },
      DOB: { type: Date, required: true },
      gender: { type: String, enum: Object.values(GENDER) },
      phone: { type: String, required: true },
      address: {
        street: String,
        city: String,
        state: String,
        zip: String,
      },
    },

    // --- Certificate & Verification ---
    certificationInfo: {
      documents: [{ name: String, url: String, validUpto: Date, issuedAt: Date }],
      verified: { type: Boolean, default: false },
      status: {
        type: String,
        enum: Object.values(DOC_VERIFY_STATUS),
        default: DOC_VERIFY_STATUS.PENDING,
      },
      verifiedAt: Date,
      rejectReason: String,
    },
    // --- ID  & Verification ---
    idVerification: {
      idType: { type: String, enum: Object.values(GOVT_ID_TYPE) },
      idNumber: { type: String },
      idAttachment: { type: String },
      verified: { type: Boolean, default: false },
      status: {
        type: String,
        enum: Object.values(DOC_VERIFY_STATUS),
        default: DOC_VERIFY_STATUS.PENDING,
      },
      verifiedAt: Date,
      rejectReason: String,
    },

    // --- Location  ---
    currentLocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }, // [lng, lat]
    },

    // ---- Availability----
    availability: {
      isAvailable: { type: Boolean, default: true },
      Monday: { available: { type: Boolean, default: false }, startTime: String, endTime: String },
      Tuesday: { available: { type: Boolean, default: false }, startTime: String, endTime: String },
      Wednesday: {
        available: { type: Boolean, default: false },
        startTime: String,
        endTime: String,
      },
      Thursday: {
        available: { type: Boolean, default: false },
        startTime: String,
        endTime: String,
      },
      Friday: { available: { type: Boolean, default: false }, startTime: String, endTime: String },
      Saturday: {
        available: { type: Boolean, default: false },
        startTime: String,
        endTime: String,
        
      },
      Sunday: { available: { type: Boolean, default: false }, startTime: String, endTime: String },
    },

    // --- Payment Data ---
    paymentInfo: {
      bankAccount: {
        accountName: { type: String },
        accountNumber: { type: String },
        bankName: { type: String },
        ifscCode: { type: String },
      },
      upiId: { type: String },
    },

    // --- Administrative State ---
    status: {
      type: String,
      enum: Object.values(TRAINER_STATUS),
      default: TRAINER_STATUS.SUBMITTED,
    },
    suspensionReason: String,
    suspendedAt: Date,
    rejectionReason: String,
    rejectedAt: Date,
    applicationCount: { type: Number, default: 1 },
    penalty: { type: Number, default: 0 },
    strikePoints: { type: Number, default: 0 },
    cancellationCount: { type: Number, default: 0 }, 
    lastStrikeDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ITrainerProfile>('TrainerProfile', TrainerProfileSchema);
