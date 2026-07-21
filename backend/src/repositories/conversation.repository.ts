import { IConversation } from '@/models/conversation.model';
import { BaseRepository } from './base.repository';
import { Model, Types } from 'mongoose';

import { IConversationRepository } from '@/interfaces/repositories/IConversation.repository';
import { IconversationPopulatedParticipants } from '@/dtos/request/chat/chat.request.dto';

export class ConversationRepository extends BaseRepository<IConversation> implements IConversationRepository {
  constructor(model: Model<IConversation>) {
    super(model);
  }
  async createConversation(data: Partial<IConversation>): Promise<IConversation | null> {
    const conversation = await this.model.create(data);
    return conversation;
  }
  async findConversation(participants: string[] | Types.ObjectId[]): Promise<IConversation | null> {
    //  const members=participants.map((p)=>new Types.ObjectId(p));
    const conversation = await this.model.findOne({ participants: { $all: participants, $size: 2 } });
    return conversation;
  }
  async getConversations(userId: string | Types.ObjectId): Promise<IconversationPopulatedParticipants[] | null> {
    const conversations = await this.model
      .find({ participants: { $in: userId } })
      .populate('participants', '_id name roles')
      .populate('contextSessionId', 'sessionName')
      .sort({ 'lastMessage.createdAt': -1 })
      .lean();
    console.log(conversations);
    return conversations as unknown as IconversationPopulatedParticipants[];
  }

  async updateLastMessage(conversationId: string | Types.ObjectId, lastMessage: { text: string; sender: string | Types.ObjectId; createdAt: Date }) {
    return await this.model.findByIdAndUpdate(conversationId, { lastMessage }, { new: true });
  }
}
