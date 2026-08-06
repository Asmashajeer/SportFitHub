import { sendMessageRequestDTO } from '@/dtos/request/chat/chat.request.dto';
import { ConversationPopulatedResponseDTO, ConversationResponseDTO, MessageResponseDTO } from '@/dtos/response/chat/chat.response.dto';
import { IConversation } from '@/models/conversation.model';


export interface IChatService {
  createConversation(conversationData: Partial<IConversation>): Promise<ConversationResponseDTO>;
  getConversations(userId: string): Promise<ConversationPopulatedResponseDTO[]>;
  getMessages(conversationId: string, lastCreatedAt: string, userId: string): Promise<MessageResponseDTO[]>;
  sendMessage(data: sendMessageRequestDTO): Promise<MessageResponseDTO>;
  markAsRead(conversationId: string, userId: string): Promise<void>;
  unreadMessageCount(conversationId: string, recipientId: string): Promise<number>;
  unreadMessageCountInbox(recipientId: string): Promise<number>;
}
