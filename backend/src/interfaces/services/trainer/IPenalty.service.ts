export interface IPenaltyService {
  applyPenalty(trainerId: string, sessionId: string, slotId: string, startDateTime: Date, sessionRevenue: number): Promise<void>
  
}
