import mongoose, { Document ,Types} from 'mongoose';

export enum UserRole {
  ADMIN = "admin",
  TRAINER = "trainer",
  USER = "user",
  PENDING = "pending", // This is the "Onboarding" state for google login
}


export interface IUser extends Document {
  _id:Types.ObjectId,
  email: string;
  password: string;
  role: UserRole;
  googleId?: string;
  isVerified:boolean;
  isBlocked: boolean;
  isActive: boolean;
  createdAt: Date;
}

export type AdminIUserView=Omit<IUser, 'password'>
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, default: '' },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: 'user',
    },
    googleId: { type: String },
    isVerified:{type:Boolean,default:false},
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
