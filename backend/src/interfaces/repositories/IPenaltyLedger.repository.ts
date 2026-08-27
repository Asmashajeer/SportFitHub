import { IPenaltyLedger } from "@/models/penaltyLedger.model";
import { IBaseRepository } from "./IBase.repository";
import { Types } from "mongoose";

export interface IPenaltyLedgerRepository extends IBaseRepository<IPenaltyLedger>{
    findByOccurrence(sessionId: string, slotId: string, startDateTime: Date): Promise<IPenaltyLedger | null>
    createPenalty(data: { trainerId: string; sessionId: string; slotId: string; startDateTime: Date; amount: number; reason: string; status: 'pending' | 'deducted' }): Promise<IPenaltyLedger>
    findPendingByTrainer(trainerId: string): Promise<IPenaltyLedger[]>
    markDeductedBulk(ids: Types.ObjectId[]): Promise<void> 
    
}