import { DocumentType, UserRole } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { IDocumentsService } from '@/interfaces/services/IDocuments.service';
import { AuthUser } from '@/middleware/auth.middleware';
import AppError from '@/utils/AppError';
import { getSignedFileUrl } from '@/utils/cloudinary';

export default class DocumentsService implements IDocumentsService {
  private _trainerRepo: ITrainerRepository;
  constructor(trainerRepo: ITrainerRepository) {
    this._trainerRepo = trainerRepo;
  }

  async getDocumentStream(type: DocumentType, trainerId: string, certId: string, user: AuthUser) {
    console.log('type: ', type);
    const trainer = await this._trainerRepo.findById(trainerId);
    // const cert = trainer.certificationInfo.documents.find(d => d._id.toString() === certId);
    // if (!cert) throw new AppError(ERROR_MESSAGES.CERT.NOT_fOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const isOwner = trainer.userId.toString() === user.id;
    const isAdmin = user.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new AppError(ERROR_MESSAGES.CERT.FORBIDDEN, STATUS_CODE.ERROR.FORBIDDEN);
    }
    let signedUrl: string;
    if (type === DocumentType.CERTIFICATE) {
      if (!certId) throw new AppError('certId is required', STATUS_CODE.ERROR.BAD_REQUEST);
      const cert = trainer.certificationInfo.documents.find((d) => d._id.toString() === certId);
      if (!cert) throw new AppError(ERROR_MESSAGES.CERT.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
      signedUrl = getSignedFileUrl(cert.url, 'image', 'authenticated');
    } else if (type === DocumentType.ID_ATTACHMENT) {
      const attachment = trainer.idVerification?.idAttachment;
      if (!attachment) throw new AppError(ERROR_MESSAGES.ID_VERIFICATION.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
      signedUrl = getSignedFileUrl(attachment, 'image', 'authenticated');
    } else {
      throw new AppError('Invalid document type', STATUS_CODE.ERROR.BAD_REQUEST);
    }
    // console.log(cert);

    // const signedUrl= getSignedFileUrl(publicId, 'image', 'authenticated');
    // console.log(signedUrl);
    const cloudRes = await fetch(signedUrl);
    if (!cloudRes.ok || !cloudRes.body) {
      console.log(cloudRes);
      throw new AppError('Could not fetch Document');
    }

    return {
      stream: cloudRes.body,
      contentType: cloudRes.headers.get('content-type') || 'application/octet-stream',
    };
  }
}
