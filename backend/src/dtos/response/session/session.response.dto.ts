// dtos/session.dto.ts (or types file, wherever your DTOs live)

import { INTENSITY_LEVEL, PAYLOAD_MODEL, SESSION_MODE, SESSION_TYPE } from "@/constants/enums";


interface BaseSessionPublicResponseDTO {
  id: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  sessionType: SESSION_TYPE;
  ageGroup: string;
  pricing: { sessionCount: number; price: number }[];
  images: string[];
  rating: number;
  score?: number; // only present on search results, optional elsewhere
}

interface SportsSessionPublicResponseDTO extends BaseSessionPublicResponseDTO {
  sessionModel: typeof PAYLOAD_MODEL.SPORT_SESSION;
  sportCategory: { _id: string; sportName: string } | string; // populated or raw ID
  
  venue: {
    name: string;
    address: string;
    location: { type: string; coordinates: [number, number] };
  };
}

interface FitnessSessionPublicResponseDTO extends BaseSessionPublicResponseDTO {
  sessionModel: typeof PAYLOAD_MODEL.FITNESS_SESSION;
  category: string;
  mode: SESSION_MODE;
  level:INTENSITY_LEVEL;
  venue?: {
    name: string;
    address: string;
    location: { type: string; coordinates: [number, number] };
  }; // optional, only present when mode === 'offline'
}

export type SessionPublicResponseDTO =
  | SportsSessionPublicResponseDTO
  | FitnessSessionPublicResponseDTO;