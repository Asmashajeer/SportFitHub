import mongoose, { Document, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  name: string;
  DOB: Date;
  gender: 'male' | 'female' | 'other';
  relationship: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  profilePic?: string;
  isPrimary:boolean;
}

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    DOB: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    relationship: { type: String },

    address: {
      street: { type: String },
      city: { type: String },
      zip: { type: String },
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },

      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
    profilePic: { type: String, default: '' },
    isPrimary:{type:Boolean,default: false}
  },
  { timestamps: true },
);

ProfileSchema.index({ location: '2dsphere' }, { sparse: true });
export default mongoose.model<IProfile>('Profile', ProfileSchema);
