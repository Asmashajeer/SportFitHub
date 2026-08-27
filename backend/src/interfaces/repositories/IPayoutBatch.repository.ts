import { IPayoutBatch } from "@/models/payoutBatch.model";

export interface IPayoutBatchRepository {
    create(data:  Partial<IPayoutBatch>): Promise<IPayoutBatch>
    findByTrainer(trainerId: string): Promise<IPayoutBatch[]> 
    sumNetAmount(dateRange:{startDate:Date,endDate:Date}):Promise<number>
}