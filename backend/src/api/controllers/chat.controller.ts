import { STATUS_CODE } from '@/constants/messages';
import { IChatService } from '@/interfaces/services/IChat.service';
import { AuthRequest } from '@/middleware/auth.middleware';
import { IAttachment } from '@/models/message.model';
import { NextFunction, Response } from 'express';
import { Readable } from 'stream';

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

  getAttachedFile= async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const conversationId=req.query.conversationId as string;
    const attachment:IAttachment={
      url:req.query.url as string,
      originalName: req.query.originalName as string,
      size:parseInt(req.query.size as string),
      mimeType:req.query.mimeType as string   
    }
   
    try {
      const { stream, contentType } = await this._chatService.getAttachedFileStream(userId,conversationId,attachment);
      res.setHeader('Content-Type', contentType);
      Readable.fromWeb(stream ).pipe(res);
    } catch (error) {
      next(error);
    }
  };
}
