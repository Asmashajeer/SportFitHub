import mongoose, { Document, Types } from 'mongoose';
import { GENDER, RELATIONSHIP } from '@/constants/enums';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  DOB: Date;
  gender: GENDER;
  phone: string;
  relationship: RELATIONSHIP;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  profilePic: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    DOB: { type: Date, required: true },
    gender: { type: String, enum: Object.values(GENDER), required: true },
    phone: { type: String, default: '' },
    relationship: { type: String, enum: Object.values(RELATIONSHIP), default: RELATIONSHIP.SELF },

    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      zip: { type: String, trim: true },
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },

      coordinates: {
        type: [Number],
        validate: {
          validator: (val: number[]) => val === undefined || val.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
    profilePic: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProfileSchema.index({ location: '2dsphere' }, { sparse: true });
export default mongoose.model<IProfile>('Profile', ProfileSchema);
