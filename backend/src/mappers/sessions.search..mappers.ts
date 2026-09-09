
import { getSignedFileUrl } from "@/utils/cloudinary";

import { PAYLOAD_MODEL } from "@/constants/enums";
import { SessionPublicResponseDTO } from '@/dtos/response/session/session.response.dto';
import {
  SessionRawResult,
  SportSessionRawResult,
  FitnessSessionRawResult,
} from "@/dtos/response/session/session.response.dto";
import { IVenue } from "@/dtos/response/session/sports.session.response.dto";

export const toSessionPublicResponseDTO = (
  data: SessionRawResult,
  sessionModel: typeof PAYLOAD_MODEL.SPORT_SESSION | typeof PAYLOAD_MODEL.FITNESS_SESSION
): SessionPublicResponseDTO => {
  //
  const formatVenue = (venue: IVenue) => ({
    name: venue?.name ?? '',
    address: venue?.address ?? '',
    location: {
      type: venue?.location?.type ?? 'Point',
      coordinates: (venue?.location?.coordinates as [number, number]) ?? [0, 0],
    },
  });

  const base = {
    id: data._id.toString(),
    sessionName: data.sessionName,
    slug: data.slug,
    description: data.description,
    duration: data.duration,
    sessionType: data.sessionType,
    ageGroup: data.ageGroup,
    pricing: data.pricing,
    images: (data.images ?? []).map((publicId) =>
      getSignedFileUrl(publicId, 'image', 'upload')
    ),
    rating: data.rating,
    score: data.score,
  };

  if (sessionModel === PAYLOAD_MODEL.SPORT_SESSION) {
    // Narrow down union to SportSessionRawResult
    const sportData = data as SportSessionRawResult;

    return {
      ...base,
      sessionModel: PAYLOAD_MODEL.SPORT_SESSION,
      sportCategory: sportData.sportCategory.toString(),
      venue: formatVenue(sportData.venue),
    };
  } else {
    // Narrow down union to FitnessSessionRawResult
    const fitnessData = data as FitnessSessionRawResult;

    return {
      ...base,
      sessionModel: PAYLOAD_MODEL.FITNESS_SESSION,
      category: fitnessData.fitnessCategory.toString(),
      mode: fitnessData.mode,
      level: fitnessData.intensityLevel,
      venue: formatVenue(fitnessData.venue),
    };
  }
};