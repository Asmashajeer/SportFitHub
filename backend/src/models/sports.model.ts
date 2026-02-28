import mongoose, { Document, Schema, Types } from 'mongoose';
export interface ISports extends Document {
  _id: Types.ObjectId;
  sportName: string;
  slug: string;
  icon: string;
  description: string;
  isActive: boolean;
}

const SportsSchema = new Schema<ISports>({
  sportName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '🏐' },
  description: { type: String },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model('SportsModel', SportsSchema);
