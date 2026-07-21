import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket.types';
import { IChatService } from '@/interfaces/services/IChat.service';
import { PAYLOAD_MODEL } from '@/constants/enums';
import { Types } from 'mongoose';
import AppError from '@/utils/AppError';

interface SendMessagePayload {
  conversationId?: string;
  recipientId?: string; // present only on first message (no conversationId yet)
  contextSessionId?: string; // optional,if conversation start from any session
  contextSessionModel?: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  text: string;
}

export const createChatHandler = (chatService: IChatService) => {
  return (io: Server, socket: AuthenticatedSocket) => {
    const userId = socket.user.id;

    socket.on('joinConversation', (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on('leaveConversation', (conversationId: string) => {
      socket.leave(conversationId);
    });

    socket.on('sendMessage', async (payload: SendMessagePayload) => {
      try {
        if (!payload.text?.trim()) {
          return socket.emit('errorMessage', 'Message cannot be empty');
        }

        let conversationId = payload.conversationId ?? '';

        let isNewConversation = false;
        if (!conversationId) {
          if (!payload.recipientId) {
            return socket.emit('errorMessage', 'recipientId required to start a new conversation');
          }

          const conversation = await chatService.createConversation({
            participants: [new Types.ObjectId(userId), new Types.ObjectId(payload.recipientId)],
            contextSessionId: new Types.ObjectId(payload.contextSessionId),
            contextSessionModel: payload.contextSessionModel,
          });
          if (!conversation) {
            console.log('conversation not found');
            return socket.emit('errorMessage', 'conversation not found');
          }

          conversationId = conversation.id;
          console.log('conversatioNID  : ', conversationId);
          isNewConversation = true;
          socket.join(conversationId);
          socket.emit('conversationCreated', { conversationId });
        }
        console.log('hello');
        const message = await chatService.sendMessage({ conversationId, sender: userId, text: payload.text.trim(), readBy: [userId] });
        if (isNewConversation) {
          io.to(payload.recipientId).emit('newConversation', { conversationId, message });
        }
        io.to(conversationId).emit('newMessage', { message, conversationId });
      } catch (error) {
        const message = error instanceof AppError ? error.message : 'Failed to send message';
        console.log(error);
        socket.emit('errorMessage', message);
      }
    });

    socket.on('markAsRead', async (conversationId: string) => {
      try {
        await chatService.markAsRead(conversationId, userId);
        socket.to(conversationId).emit('messagesRead', { conversationId, readerId: userId });
      } catch (err) {
        socket.emit('errorMessage', 'Failed to mark messages as read');
      }
    });
  };
};
