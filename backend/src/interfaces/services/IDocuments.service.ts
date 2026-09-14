import { DocumentType } from '@/constants/enums';
import { AuthUser } from '@/middleware/auth.middleware';


export interface IDocumentsService {
  getDocumentStream(type: DocumentType, trainerId: string, certId: string, user: AuthUser);
}
