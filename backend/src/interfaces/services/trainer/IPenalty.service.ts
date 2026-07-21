export interface IPenaltyService {
  applyPenalty(trainerId: string, sessionRevenue: number): Promise<void>;
}
