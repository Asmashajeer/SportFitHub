import mongoose, { Schema, Types } from 'mongoose';
import { Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  //   receiver: Types.ObjectId;
  text: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
const MessageSchema = new Schema(
  {
    conversationId: { type: Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true },
    // receiver:{type:Types.ObjectId,ref:"User",required:true},
    text: { type: String, required: true, trim: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
