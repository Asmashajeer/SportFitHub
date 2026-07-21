import { ICertification, ITrainerProfile } from '@/models/trainerProfile.model';
import { Types } from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from '@/context/timezone.context';
import { ITrainerPopulated } from '@/dtos/response/admin/trainer.response.dto';

interface ITrainerProfilePopulatedUser extends Omit<ITrainerProfile, 'userId'> {
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}
export const toAdminTrainersResponseDTO = (trainer: ITrainerProfilePopulatedUser) => {
  const timezone = getTimezone();
  return {
    id: trainer._id.toString(),
    userId: trainer.userId._id.toString(),
    name: trainer.userId.name,
    email: trainer.userId.email,
    // basic Info Branding
    category: trainer.category,
    displayName: trainer.displayName,
    coreDiscipline: trainer.coreDiscipline,
    specialties: trainer.specialties,
    experience: trainer.experience,
    languages: trainer.languages,
    isCertsVerified: trainer.certificationInfo.status,
    isIdVerified: trainer.idVerification.status,
    status: trainer.status,
    createdAt: formatInTimeZone(trainer.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};
export const toTrainerProfileDTOPopulatedUser = (trainer: ITrainerPopulated) => {
  const timezone = getTimezone();
  return {
    id: trainer._id.toString(),
    userId: trainer.userId._id.toString(),
    email: trainer.userId.email,
    fcmToken: trainer.userId.fcmToken ? trainer.userId.fcmToken : '',
    category: trainer.category,
    displayName: trainer.displayName,
    coreDiscipline: trainer.coreDiscipline,
    bio: trainer.bio,
    specialties: trainer.specialties ? [...trainer.specialties] : [],
    experience: trainer.experience,
    languages: trainer.languages,
    profilePic: trainer.profilePic,
    pricing: trainer.pricing,

    personalInfo: {
      ...trainer.personalInfo,

      DOB: trainer.personalInfo?.DOB?.toISOString() || '',
      address: trainer.personalInfo?.address ? { ...trainer.personalInfo.address } : {},
    },

    certificationInfo: {
      documents: (trainer.certificationInfo?.documents || []).map((doc: ICertification) => ({
        id: doc._id.toString(),
        name: doc.name,
        url: doc.url,
        validUpto: doc.validUpto?.toString(),
        issuedAt: doc.issuedAt?.toString(),
      })),

      status: trainer.certificationInfo?.status,
      verified: trainer.certificationInfo?.verified ?? false,
      rejectReason: trainer.certificationInfo?.rejectReason || '',

      verifiedAt: trainer.certificationInfo?.verifiedAt?.toISOString(),
    },

    idVerification: {
      ...trainer.idVerification,
      verifiedAt: trainer.idVerification?.verifiedAt?.toISOString(),
    },

    currentLocation: trainer.currentLocation ? { ...trainer.currentLocation } : undefined,
    availability: trainer.availability ? { ...trainer.availability } : undefined,

    paymentInfo: {
      bankAccount: trainer.paymentInfo?.bankAccount ? { ...trainer.paymentInfo.bankAccount } : {},

      upiId: trainer.paymentInfo?.upiId,
    },

    status: trainer.status,
    verificationRemarks: {
      fields: trainer.verificationRemarks?.fields,
      changedAt: trainer.verificationRemarks?.changedAt?.toString(),
    },
    suspensionReason: trainer.suspensionReason,
    suspendedAt: trainer.suspendedAt ? formatInTimeZone(trainer.suspendedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX') : '',
    rejectionReason: trainer.rejectionReason,
    rejectedAt: trainer.rejectedAt ? formatInTimeZone(trainer.rejectedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX') : '',
    applicationCount: trainer.applicationCount || 0,
    penalty: trainer.penalty,
    strikePoints: trainer.strikePoints,
    cancellationCount: trainer.cancellationCount,
    lastStrikeDate: trainer.lastStrikeDate ? formatInTimeZone(trainer.lastStrikeDate, timezone, 'yyyy-MM-dd HH:mm:ssXXX') : '',
    createdAt: formatInTimeZone(trainer.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),

    updatedAt: formatInTimeZone(trainer.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};
