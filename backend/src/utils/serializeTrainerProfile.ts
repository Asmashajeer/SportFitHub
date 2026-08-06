// src/utils/serializeTrainerProfile.ts

import { ICertification, ITrainerProfile } from '@/models/trainerProfile.model';
import { getSignedFileUrl } from './cloudinary';

import { UserRole } from '@/constants/enums';
import { ITrainerPopulated } from '@/dtos/response/admin/trainer.response.dto';

interface Viewer {
  id?: string;
  role?: string;
}

export const serializeTrainerProfile = (trainer: ITrainerProfile | ITrainerPopulated, viewer: Viewer = {}) => {
  const isOwner = viewer.id === trainer.userId.toString()//|| viewer.id=== trainer.userId._id.toString();
  const isAdmin = viewer.role === UserRole.ADMIN;
  const canSeePrivate = isOwner || isAdmin;
  const plain = trainer.toObject();

  return {
    ...plain,
    profilePic: getSignedFileUrl(plain.profilePic, 'image', 'upload'),
    idVerification: {
      ...plain.idVerification,
      idAttachment: canSeePrivate ? plain.idVerification.idAttachment : undefined,
    },
    certificationInfo: {
      ...plain.certificationInfo,
      documents: canSeePrivate
        ? plain.certificationInfo.documents.map((doc: ICertification) => ({
            ...doc,
          }))
        : [],
    },
  };
};
