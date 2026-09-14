import { DocumentType } from '@/constants/enums';

import { IDocumentsService } from '@/interfaces/services/IDocuments.service';
import { AuthRequest } from '@/middleware/auth.middleware';

import {  Response } from 'express';
import { Readable } from 'stream';

export default class DocumentsController {
  private _documentsService: IDocumentsService;

  constructor(documentsService: IDocumentsService) {
    this._documentsService = documentsService;
  }
  

  getDocumentFile = async (req: AuthRequest, res: Response) => {

    const { type, trainerId, certId } = req.query;
    if (!type || typeof type !== 'string') {
      return res.status(400).json({ message: 'type is required' });
    }

    if (!trainerId || typeof trainerId !== 'string') {
      return res.status(400).json({ message: 'trainerId is required' });
    }

    const { stream, contentType } = await this._documentsService.getDocumentStream(type as DocumentType, trainerId, typeof certId === 'string' ? certId : undefined, req.user);

    res.setHeader('Content-Type', contentType);
    Readable.fromWeb(stream ).pipe(res);
  };
}
