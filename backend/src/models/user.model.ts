import mongoose, { Document ,Types} from 'mongoose';
import { UserRole } from '@/constants/enums';


export interface IUser extends Document {
  _id:Types.ObjectId,
  name:string;
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
