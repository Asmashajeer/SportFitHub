import { PAGINATION_LIMIT } from '@/constants/enums';
import { IMessage } from '@/models/message.model';
import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { Types } from 'mongoose';
import { IMessageRepository } from '@/interfaces/repositories/IMessage.repository';

export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor(model: Model<IMessage>) {
    super(model);
  }
  async findMessages(conversationId: string | Types.ObjectId, lastCreatedAt: string): Promise<IMessage[] | null> {
    const query: FilterQuery<IMessage> = { conversationId };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) }; // cursor-based pagination
    }
    return await this.model
      .find(query)

      .limit(PAGINATION_LIMIT);
  }

  async markAsRead(conversationId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<any | null> {
    return await this.model.updateMany({ conversationId, readBy: { $ne: userId } }, { $push: { readBy: userId } });
  }
  async countUnreadByConversationId(conversationId: string | Types.ObjectId, recipientId: string | Types.ObjectId): Promise<number> {
    return await this.model.countDocuments({
      conversationId,
      readBy: { $ne: recipientId },
    });
  }

  async countUnreadInbox(conversationIds: (string | Types.ObjectId)[], recipientId: string | Types.ObjectId): Promise<number> {
    return await this.model.countDocuments({
      conversationId: { $in: conversationIds },
      readBy: { $ne: recipientId },
    });
  }
}
