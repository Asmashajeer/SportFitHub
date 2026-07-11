import mongoose, { Document, Types } from 'mongoose';
import { UserRole } from '@/constants/enums';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
  activeRole:UserRole;
  googleId?: string;
  timezone:string;
  isVerified: boolean;
  isBlocked: boolean;
  isActive: boolean;
  fcmToken: string
  createdAt: Date;
}

export type AdminIUserView = Omit<IUser, 'password'>;
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, default: '' },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: ['user'],
    },
    activeRole: {
      type: String,
      enum: Object.values(UserRole),
      default: 'user',
    },
    googleId: { type: String },
     timezone: { type: String, default: 'UTC' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    fcmToken: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
