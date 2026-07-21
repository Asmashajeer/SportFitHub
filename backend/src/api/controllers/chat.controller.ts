import { STATUS_CODE } from '@/constants/messages';
import { IChatService } from '@/interfaces/services/IChat.service';
import { AuthRequest } from '@/middleware/auth.middleware';
import { NextFunction, Response } from 'express';

export class ChatController {
  private _chatService: IChatService;
  constructor(chatService: IChatService) {
    this._chatService = chatService;
  }

  createConversation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { SecondUserId, contextSessionId, contextSessionModel } = req.body;
    const participants = [userId, SecondUserId];
    try {
      const conversation = await this._chatService.createConversation({ participants, contextSessionId, contextSessionModel });
      res.status(STATUS_CODE.SUCCESS.CREATED).json(conversation);
    } catch (error) {
      next(error);
    }
  };

  getConversations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    console.log(userId, req.user.role);

    try {
      const conversations = await this._chatService.getConversations(userId);
      res.status(STATUS_CODE.SUCCESS.OK).json(conversations);
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const conversationId = req.query.conversationId as string;
    const lastCreatedAt = req.query.lastCreatedAt as string;
    const userId = req.user.id;
    try {
      const messages = await this._chatService.getMessages(conversationId, lastCreatedAt, userId);
      res.status(STATUS_CODE.SUCCESS.OK).json(messages);
    } catch (error) {
      next(error);
    }
  };
  getUnreadMessageCount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    try {
      const unreadCount = await this._chatService.unreadMessageCountInbox(userId);
      res.status(STATUS_CODE.SUCCESS.OK).json(unreadCount);
    } catch (error) {
      next(error);
    }
  };
}
