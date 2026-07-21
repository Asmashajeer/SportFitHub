import { AuthUser } from '@/middleware/auth.middleware';
import { DocumentType } from '@/services/documents.service';

export interface IDocumentsService {
  getDocumentStream(type: DocumentType, trainerId: string, certId: string, user: AuthUser);
}
