import { IFitnessSessionDetailsPopulated, IFitnessSessionPopulated } from '@/dtos/response/session/fitness.session.response.dto';
import { IFitnessSession } from '@/models/fitnessSession.model';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from '@/context/timezone.context';
import { getSignedFileUrl } from '@/utils/cloudinary';

export const toFitnessSessionResponseDTO = (session: Partial<IFitnessSession>) => {
  const timezone = getTimezone();
  return {
    id: session._id.toString(),
    trainerId: session.trainerId.toString(),
    sessionName: session.sessionName,
    slug: session.slug,
    fitnessCategory: session.fitnessCategory.toString(),
    description: session.description,
    duration: session.duration,
    ageGroup: session.ageGroup,
    gender: session.gender,
    sessionType: session.sessionType,
    maxCapacity: session.maxCapacity,
    enrolledCount: session.enrolledCount,
    intensityLevel: session.intensityLevel,
    mode: session.mode,
    meetingLink: session.meetingLink,
    venue: session.venue,
    amenities: session.amenities,
    requirements: session.requirements,
    timeSlots: session.timeSlots,
    pricing: session.pricing,
    cancellationPolicy: session.cancellationPolicy,
    cancellationWindow: session.cancellationWindow,
    bookingDeadline: session.bookingDeadline,
    isActive: session.isActive,
    isDeleted: session.isDeleted,
    isApproved: session.isApproved,
    images: (session.images ?? []).map((publicId) => getSignedFileUrl(publicId, 'image', 'upload')),
    rating: session.rating,
    createdAt: formatInTimeZone(session.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    updatedAt: formatInTimeZone(session.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};

export const toFitnessSessionPublicDTO = (session: IFitnessSessionPopulated) => {
  const timezone = getTimezone();
  return {
    id: session._id.toString(),
    trainerId: session.trainerId.toString(),
    fitnessCategory: session.fitnessCategory
      ? {
          id: session.fitnessCategory._id.toString(),
          programName: session.fitnessCategory.programName,
          slug: session.fitnessCategory.slug,
          description: session.fitnessCategory.description,
        }
      : null,

    sessionName: session.sessionName,
    slug: session.slug,
    description: session.description,
    duration: session.duration,
    ageGroup: session.ageGroup,
    gender: session.gender,
    sessionType: session.sessionType,
    maxCapacity: session.maxCapacity,
    enrolledCount: session.enrolledCount,
    intensityLevel: session.intensityLevel,
    mode: session.mode,
    meetingLink: session.meetingLink,
    venue: session.venue,
    amenities: session.amenities,
    requirements: session.requirements,
    timeSlots: session.timeSlots,
    pricing: session.pricing,
    cancellationPolicy: session.cancellationPolicy,
    cancellationWindow: session.cancellationWindow,
    bookingDeadline: session.bookingDeadline,
    isActive: session.isActive,
    isDeleted: session.isDeleted,
    isApproved: session.isApproved,
    images: (session.images ?? []).map((publicId) => getSignedFileUrl(publicId, 'image', 'upload')),
    rating: session.rating,
    createdAt: formatInTimeZone(session.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    updatedAt: formatInTimeZone(session.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};

export const toFitnessSessionDetailedPublicDTO = (session: IFitnessSessionDetailsPopulated) => {
  const timezone = getTimezone();
  return {
    id: session._id.toString(),

    trainer: session.trainerId
      ? {
          id: session.trainerId._id.toString(),
          userId: session.trainerId.userId.toString(),
          displayName: session.trainerId.displayName,
          profilePic: session.trainerId.profilePic ? getSignedFileUrl(session.trainerId.profilePic, 'image', 'upload') : null,
          coreDiscipline: session.trainerId.coreDiscipline,
          specialties: session.trainerId.specialties,
          experience: session.trainerId.experience,
          languages: session.trainerId.languages,
          averageRating: session.trainerId.averageRating,
        }
      : null,
    fitnessCategory: session.fitnessCategory
      ? {
          id: session.fitnessCategory._id.toString(),
          programName: session.fitnessCategory.programName,
          slug: session.fitnessCategory.slug,
          description: session.fitnessCategory.description,
        }
      : null,

    sessionName: session.sessionName,
    slug: session.slug,
    description: session.description,
    duration: session.duration,
    ageGroup: session.ageGroup,
    gender: session.gender,
    sessionType: session.sessionType,
    maxCapacity: session.maxCapacity,
    enrolledCount: session.enrolledCount,
    intensityLevel: session.intensityLevel,
    mode: session.mode,
    meetingLink: session.meetingLink,
    venue: session.venue,
    amenities: session.amenities,
    requirements: session.requirements,
    timeSlots: session.timeSlots,
    pricing: session.pricing,
    cancellationPolicy: session.cancellationPolicy,
    cancellationWindow: session.cancellationWindow,
    bookingDeadline: session.bookingDeadline,
    isActive: session.isActive,
    isDeleted: session.isDeleted,
    isApproved: session.isApproved,
    images: (session.images ?? []).map((publicId) => getSignedFileUrl(publicId, 'image', 'upload')),
    rating: session.rating,
    createdAt: formatInTimeZone(session.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    updatedAt: formatInTimeZone(session.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};
