import { PAYLOAD_MODEL, SIMILARITY_THRESHOLD } from "@/constants/enums";
import { SessionPublicResponseDTO } from "@/dtos/response/session/session.response.dto";
import { IFitnessSessionRepository } from "@/interfaces/repositories/IFitness.session.repository";
import { ISportsSessionRepository } from "@/interfaces/repositories/ISports.session.repository";
import { IEmbeddingService } from "@/interfaces/services/IEmbeddingService";
import { ISessionsSearchService } from "@/interfaces/services/session/ISessions.search.service";
import { toSessionPublicResponseDTO } from "@/mappers/sessions.search..mappers";





export class SessionsSearchService implements ISessionsSearchService {
   private _sportSessionRepo: ISportsSessionRepository;
    private _fitnessSessionRepo: IFitnessSessionRepository;
    private _embeddingService: IEmbeddingService;
  constructor( sportSessionRepo: ISportsSessionRepository,fitnessSessionRepo: IFitnessSessionRepository, embeddingService: IEmbeddingService  ) {
    this._sportSessionRepo= sportSessionRepo;
    this._fitnessSessionRepo= fitnessSessionRepo;
    this._embeddingService= embeddingService;
  }


  async searchSessions(query: string): Promise<SessionPublicResponseDTO[]> {
    const queryEmbedding = await this._embeddingService.embedText(query);

    const [sportsResults, fitnessResults] = await Promise.all([
      this._sportSessionRepo.vectorSearch(queryEmbedding),
      this._fitnessSessionRepo.vectorSearch(queryEmbedding),
    ]);
   
    const taggedSports = sportsResults
      .filter((s: any) => s.score >= SIMILARITY_THRESHOLD)
      .map((s: any) => toSessionPublicResponseDTO(s, PAYLOAD_MODEL.SPORT_SESSION));

    const taggedFitness = fitnessResults
      .filter((s: any) => s.score >= SIMILARITY_THRESHOLD)
      .map((s: any) => toSessionPublicResponseDTO(s, PAYLOAD_MODEL.FITNESS_SESSION));

    return [...taggedSports, ...taggedFitness].sort((a: any, b: any) => b.score - a.score);
  }
}