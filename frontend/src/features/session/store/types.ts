import type { PAYLOAD_MODEL } from "@/constants/constants";
import type { FitnessSessionPublicResponseData } from "./fitness.session.types";
import type { SportsSessionPublicResponseData } from "./session.types";

//--------for semantic search
export type SessionPublicResponseData =
  | (SportsSessionPublicResponseData & { sessionModel:typeof PAYLOAD_MODEL.SPORT_SESSION })
  | (FitnessSessionPublicResponseData & { sessionModel: typeof PAYLOAD_MODEL.FITNESS_SESSION });