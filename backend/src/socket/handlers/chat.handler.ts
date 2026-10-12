import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../socket.types';
import { IChatService } from '@/interfaces/services/IChat.service';
import { PAYLOAD_MODEL } from '@/constants/enums';
import { Types } from 'mongoose';
import AppError from '@/utils/AppError';
import { SendMessagePayload } from '../chat.types';
import { IAttachment } from '@/models/message.model';



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
      const { type = 'text', attachment } = payload;

      let messageData: {
        type: 'text' | 'file';
        text: string;
        attachment?: IAttachment;
      };
      if (type === 'file') {
        if (!attachment?.url) {
          return socket.emit('errorMessage', 'Attachment missing');
        }

        // The uploader's folder must match the sender
        if (!attachment.url.startsWith(`chat/${userId}/`)) {
          return  socket.emit('errorMessage',  'Invalid attachment' );
        }

        messageData = { type: 'file', text: '', attachment };
      } else {
        const text = payload.text?.trim();
        if (!text) return  socket.emit('errorMessage',  'Empty message' );
        messageData = { type: 'text', text };
      }

      try {
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
                                                                                                                                                                                                                                                                                                                                                                                                                            
        const message = await chatService.sendMessage({ conversationId, sender: userId, ...messageData, readBy: [userId] });
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
        console.log(err);
        socket.emit('errorMessage', 'Failed to mark messages as read');
      }
    });
  };
};
