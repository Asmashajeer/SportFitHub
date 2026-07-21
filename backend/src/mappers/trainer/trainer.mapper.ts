import { TrainerProfileResponseDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { PendingTrainersBasicDTO } from '@/dtos/response/admin/trainer.response.dto';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { ITrainerProfile, ICertification } from '@/models/trainerProfile.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from '@/context/timezone.context';

export const toTrainerProfileData = (profile: Partial<ITrainerProfile>): TrainerProfileResponseDTO => {
  {
    // const timezone = getTimezone();
    return {
      basicInfo: {
        displayName: profile.displayName,
        profilePic: profile.profilePic,
      },
      verification: {
        overallStatus: profile.status,
        idStatus: {
          type: profile.idVerification.idType,
          status: profile.idVerification.status,
        },
        certificationStatus: {
          count: profile.certificationInfo.documents.length,
          status: profile.certificationInfo.status,
        },
      },
      createdAt: profile.createdAt.toString(),
    };
  }
};

//trainerManagement admin Approvals Basic Data
export const toPendingTrainersBasicData = (profile: Partial<ITrainerProfile>): PendingTrainersBasicDTO => {
  // const timezone = getTimezone();
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    // basic Info Branding
    category: profile.category,
    displayName: profile.displayName,
    specialties: profile.specialties,
    experience: profile.experience,
    profilePic: profile.profilePic,

    // Personal Info
    personalInfo: {
      fullName: profile.personalInfo.fullName,
      phone: profile.personalInfo.phone,
    },
    // Administrative State
    status: profile.status,
    verificationRemarks: {
      fields: profile.verificationRemarks?.fields,
      changedAt: profile.verificationRemarks?.changedAt?.toString(),
    },
    // Timestamps
    createdAt: profile.createdAt.toISOString(),
    certCount: profile.certificationInfo.documents.length,
  };
};

export const ToTrainerProfileDTO = (trainer: ITrainerProfile): TrainerProfileDTO => {
  const timezone = getTimezone();
  return {
    id: trainer._id.toString(),
    userId: trainer.userId.toString(),

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
