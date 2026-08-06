import { IMessage } from '@/models/message.model';
import { IBaseRepository } from './IBase.repository';
import {  Types } from 'mongoose';

export interface IMessageRepository extends IBaseRepository<IMessage> {
  findMessages(conversationId: string | Types.ObjectId, lastCreatedAt: string): Promise<IMessage[] | null>;
  markAsRead(conversationId: string | Types.ObjectId, userId: string | Types.ObjectId);
  countUnreadByConversationId(conversationId: string | Types.ObjectId, recipientId: string | Types.ObjectId): Promise<number>;
  countUnreadInbox(conversationIds: (string | Types.ObjectId)[], recipientId: string | Types.ObjectId): Promise<number>;
}
