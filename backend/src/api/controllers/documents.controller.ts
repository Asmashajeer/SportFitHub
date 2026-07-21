import { DocumentType } from '@/constants/enums';

import { IDocumentsService } from '@/interfaces/services/IDocuments.service';
import { AuthRequest } from '@/middleware/auth.middleware';

import { NextFunction, Response } from 'express';
import { Readable } from 'stream';

export default class DocumentsController {
  private _documentsService: IDocumentsService;

  constructor(documentsService: IDocumentsService) {
    this._documentsService = documentsService;
  }
  // getdocumentsViewUrl = async (req: AuthRequest, res: Response,next:NextFunction):Promise<void> => {
  //     const {trainerId}=req.query;
  //     console.log('trainerId:',trainerId);
  //     const certId=req.params.certId;
  //     const url = await this._documentsService.getViewUrl(certId, trainerId as string, req.user);
  //      res.status(STATUS_CODE.SUCCESS.OK).json(url);
  // };

  getDocumentFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { type, trainerId, certId } = req.query;
    if (!type || typeof type !== 'string') {
      return res.status(400).json({ message: 'type is required' });
    }

    if (!trainerId || typeof trainerId !== 'string') {
      return res.status(400).json({ message: 'trainerId is required' });
    }

    const { stream, contentType } = await this._documentsService.getDocumentStream(type as DocumentType, trainerId, typeof certId === 'string' ? certId : undefined, req.user);

    res.setHeader('Content-Type', contentType);
    Readable.fromWeb(stream as any).pipe(res);
  };
}
