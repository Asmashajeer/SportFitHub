import { Review_Type } from "@/constants/enums";
import mongoose, { Document, Types } from "mongoose";

const { Schema } = mongoose;


export interface IReview extends Document{
  _id: Types.ObjectId;
  rating: number;                // 1-5
  review?: string;
  userId: Types.ObjectId            
  reviewableType: Review_Type; 
  reviewableId: Types.ObjectId;          //ref to reviewable_type
  createdAt: Date;
  updatedAt: Date;
}


const reviewSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true, maxlength: 1000 },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    reviewableType: {
      type: String,
      enum: Review_Type,
      required: true,
    },
    reviewableId: {
      type: Types.ObjectId,
      required: true,
      refPath: "reviewableType", 
    },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, reviewableType: 1, reviewableId: 1 }, { unique: true });
reviewSchema.index({ reviewableType: 1, reviewableId: 1 });

export default mongoose.model<IReview>("Review", reviewSchema);
