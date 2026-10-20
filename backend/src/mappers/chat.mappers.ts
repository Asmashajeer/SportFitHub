import { IconversationPopulatedParticipants } from '@/dtos/request/chat/chat.request.dto';
import { IConversation } from '@/models/conversation.model';
import { IMessage } from '@/models/message.model';
import { getSignedFileUrl } from '@/utils/cloudinary';

export const toConversationResponseDTO = (conversation: Partial<IConversation>) => {
  return {
    id: conversation._id.toString(),
    participants: conversation.participants.map((p) => p.toString()),
    contextSessionId: conversation.contextSessionId ? conversation.contextSessionId.toString() : null,
    contextSessionModel: conversation.contextSessionModel ? conversation.contextSessionModel : null,
    lastMessage: conversation.lastMessage
      ? {
          text: conversation.lastMessage.text,
          sender: conversation.lastMessage.sender ? conversation.lastMessage.sender.toString() : '',
          createdAt: conversation.lastMessage.createdAt ? conversation.lastMessage.createdAt.toString() : '',
        }
      : null,
  };
};

export const toConversationPopulatedResponseDTO = (conversation: IconversationPopulatedParticipants) => {
  return {
    id: conversation._id.toString(),
    participants: conversation.participants.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      roles: p.roles,
      profilePic:getSignedFileUrl(p.profilePic,'image','upload'),
    })),
    contextSession: conversation.contextSessionId
      ? {
          id: conversation.contextSessionId._id.toString(),
          name: conversation.contextSessionId.sessionName,
        }
      : null,
    contextSessionModel: conversation.contextSessionModel ? conversation.contextSessionModel : null,
    lastMessage: conversation.lastMessage
      ? {
          text: conversation.lastMessage.text,
          sender: conversation.lastMessage.sender ? conversation.lastMessage.sender.toString() : '',
          createdAt: conversation.lastMessage.createdAt ? conversation.lastMessage.createdAt.toString() : '',
        }
      : null,
  };
};

export const toMessageResponseDTO = (message: IMessage) => {
  return {
    conversationId: message.conversationId.toString(),
    sender: message.sender.toString(),
    type: message.type,
    text: message.text,
    attachment:
      message.type === 'file' && message.attachment
        ? {
            // url: getSignedFileUrl(message.attachment.url, message.attachment.mimeType, 'authenticated'),
            url: message.attachment.url,
            originalName: message.attachment.originalName,
            size: message.attachment.size,
            mimeType: message.attachment.mimeType,
          }
        : undefined,

    readBy: message.readBy.map((u) => u.toString()),
    createdAt: message.createdAt.toString(),
    updatedAt: message.updatedAt.toString(),
  };
};
