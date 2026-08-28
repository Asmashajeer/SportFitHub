import { PAYLOAD_MODEL } from "@/constants/enums";
import { SessionPublicResponseDTO } from "@/dtos/response/session/session.response.dto";
import { getSignedFileUrl } from "@/utils/cloudinary";




export const toSessionPublicResponseDTO = (
  data: any,
  sessionModel: typeof PAYLOAD_MODEL.SPORT_SESSION | typeof PAYLOAD_MODEL.FITNESS_SESSION
): SessionPublicResponseDTO => {
  const base = {
    id: data._id,
    sessionName: data.sessionName,
    slug: data.slug,
    description: data.description,
    duration: data.duration,
    sessionType: data.sessionType,
    ageGroup: data.ageGroup,
    pricing: data.pricing,
    images: (data.images ?? []).map((publicId) => getSignedFileUrl(publicId, 'image', 'upload')),
    rating: data.rating,
    score: data.score,
  };

  if (sessionModel === PAYLOAD_MODEL.SPORT_SESSION) {
    return {
      ...base,
      sessionModel: PAYLOAD_MODEL.SPORT_SESSION,
      sportCategory: data.sportCategory,
      
      venue: data.venue,
    };
  }
  else{
    return {
      ...base,
      sessionModel: PAYLOAD_MODEL.FITNESS_SESSION,
      category: data.fitnessCategory,
      mode: data.mode,
      level: data.intensityLevel,
      venue: data.venue,
    };
  }
};