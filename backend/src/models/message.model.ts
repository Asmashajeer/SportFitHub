import mongoose, { Schema, Types } from 'mongoose';
import { Document } from 'mongoose';

export type MessageType = 'text' | 'file';

export interface IAttachment {
  url: string; //cloudinary publicId
  originalName: string;
  size: number;
  mimeType: string;
}
const AttachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },   
    originalName: { type: String, required: true, maxlength: 255 },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
  },
  { _id: false }
);

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  type: MessageType;
  text: string;
  attachment?: IAttachment;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}


const MessageSchema = new Schema(
  {
    conversationId: { type: Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['text', 'file'], default: 'text' },
    text: {
      type: String,
      trim: true,
      default: '',
      // text is only required for text messages
      required: function (this: IMessage) {
        return this.type === 'text';
      },
    },
    attachment: {
      type: AttachmentSchema,
      required: function (this: IMessage) {
        return this.type === 'file';
      },
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
