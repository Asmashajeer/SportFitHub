import { PAYLOAD_MODEL } from '@/constants/enums';
import mongoose, { Schema, Types } from 'mongoose';
import { Document } from 'mongoose';


interface ILastMessage {
  text: string;
  sender?: Types.ObjectId;
  createdAt?: Date;
}
export interface IConversation extends Document {
  participants: Types.ObjectId[];
  contextSessionId: Types.ObjectId;
  contextSessionModel: PAYLOAD_MODEL; // or: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL]
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: 'User', required: true }],
    contextSessionId: { type: Types.ObjectId, refPath: 'contextSessionModel', default: null },
    contextSessionModel: { type: String, enum: Object.values(PAYLOAD_MODEL), default: null },
    lastMessage: {
      text: { type: String, default: '' },
      sender: { type: Types.ObjectId, ref: 'User' },
      createdAt: { type: Date },
    },
    // { type:Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
