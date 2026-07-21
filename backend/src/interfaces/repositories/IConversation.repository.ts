import { IConversation } from '@/models/conversation.model';
import { IBaseRepository } from './IBase.repository';
import { Types, UpdateQuery } from 'mongoose';
import { IconversationPopulatedParticipants } from '@/dtos/request/chat/chat.request.dto';

export interface IConversationRepository extends IBaseRepository<IConversation> {
  createConversation(data: Partial<IConversation>): Promise<IConversation>;
  findConversation(participants: string[] | Types.ObjectId[]): Promise<IConversation | null>;
  getConversations(userId: string | Types.ObjectId): Promise<IconversationPopulatedParticipants[] | null>;
  updateLastMessage(conversationId: string | Types.ObjectId, lastMessage: UpdateQuery<IConversation>);
}
