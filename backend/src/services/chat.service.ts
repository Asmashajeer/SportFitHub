import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { sendMessageRequestDTO } from '@/dtos/request/chat/chat.request.dto';
import { ConversationPopulatedResponseDTO, ConversationResponseDTO, MessageResponseDTO } from '@/dtos/response/chat/chat.response.dto';
import { IConversationRepository } from '@/interfaces/repositories/IConversation.repository';
import { IMessageRepository } from '@/interfaces/repositories/IMessage.repository';
import { IChatService } from '@/interfaces/services/IChat.service';
import { toConversationPopulatedResponseDTO, toConversationResponseDTO, toMessageResponseDTO } from '@/mappers/chat.mappers';
import { IConversation } from '@/models/conversation.model';

import AppError from '@/utils/AppError';
import { Types } from 'mongoose';

export class ChatService implements IChatService {
  private _conversationRepo: IConversationRepository;
  private _messageRepo: IMessageRepository;
  constructor(conversationRepo: IConversationRepository, messageRepo: IMessageRepository) {
    this._conversationRepo = conversationRepo;
    this._messageRepo = messageRepo;
  }

  // ---------------create a new conversation or find existing one----------------
  createConversation = async (conversationData: Partial<IConversation>): Promise<ConversationResponseDTO> => {
    const { participants } = conversationData;
    let data = await this._conversationRepo.findConversation(participants);
    if (!data) {
      data = await this._conversationRepo.createConversation(conversationData);
    }
    const conversation = toConversationResponseDTO(data);
    return conversation;
  };

  //--------------------get convesations by userId----------------
  getConversations = async (userId: string): Promise<ConversationPopulatedResponseDTO[]> => {
    const allConversations = await this._conversationRepo.getConversations(userId);
    const conversations = allConversations.map((conv) => toConversationPopulatedResponseDTO(conv));
    return conversations;
  };

  //-------------------------get messages-----------
  getMessages = async (conversationId: string, lastCreatedAt: string, userId: string): Promise<MessageResponseDTO[]> => {
    this.checkConversation_Participants(conversationId, userId);
    const allMessages = await this._messageRepo.findMessages(conversationId, lastCreatedAt);
    console.log(allMessages);
    const messages = allMessages.map((msg) => toMessageResponseDTO(msg));
    return messages;
  };

  //--------------- create message-----------------
  sendMessage = async (data: sendMessageRequestDTO): Promise<MessageResponseDTO> => {
    this.checkConversation_Participants(data.conversationId, data.sender);
    const message = await this._messageRepo.create({
      conversationId: new Types.ObjectId(data.conversationId),
      sender: new Types.ObjectId(data.sender),
      text: data.text,
      readBy: [new Types.ObjectId(data.sender)], // sender  reads their own message
    });

    // keep the denormalized lastMessage in sync (from Step 1 design)
    await this._conversationRepo.updateLastMessage(data.conversationId, {
      text: data.text,
      sender: data.sender,
      createdAt: message.createdAt,
    });
    console.log(message);
    return toMessageResponseDTO(message);
  };

  //--------------------mark as read-------------------
  markAsRead = async (conversationId: string, userId: string): Promise<void> => {
    this.checkConversation_Participants(conversationId, userId);
    return await this._messageRepo.markAsRead(conversationId, userId);
  };

  unreadMessageCount = async (conversationId: string, recipientId: string): Promise<number> => {
    const unreadCount = await this._messageRepo.countUnreadByConversationId(conversationId, recipientId);
    return unreadCount;
  };
  unreadMessageCountInbox = async (recipientId: string): Promise<number> => {
    const conversations = await this._conversationRepo.find({ participants: { $in: recipientId } });
    const conversationIds = conversations.map((conv) => conv._id);
    const unreadCount = await this._messageRepo.countUnreadInbox(conversationIds, recipientId);
    console.log(unreadCount);
    return unreadCount;
  };

  private checkConversation_Participants = async (conversationId: string, userId: string) => {
    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversationId) {
      throw new AppError(ERROR_MESSAGES.CHAT.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === userId);
    if (!isParticipant) {
      throw new AppError(ERROR_MESSAGES.CHAT.UNAUTHORIZED, STATUS_CODE.ERROR.FORBIDDEN);
    }
    return conversation;
  };
}
