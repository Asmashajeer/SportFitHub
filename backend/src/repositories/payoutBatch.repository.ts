import { IPayoutBatch } from "@/models/payoutBatch.model";
import { BaseRepository } from "./base.repository";
import { IPayoutBatchRepository } from "@/interfaces/repositories/IPayoutBatch.repository";
import { FilterQuery, Model } from "mongoose";

export class PayoutBatchRepository extends BaseRepository<IPayoutBatch> implements IPayoutBatchRepository{
    
    constructor(model:Model<IPayoutBatch>){
        super(model);
    }
  async create(data: Partial<IPayoutBatch>): Promise<IPayoutBatch> {
    return this.model.create(data);
  }



  async findByTrainer(trainerId: string): Promise<IPayoutBatch[]> {
    return this.model.find({ trainerId }).sort({ runAt: -1 });
  }

  async findFailedBatches(): Promise<IPayoutBatch[]> {
    return this.model.find({ status: 'failed' }).sort({ runAt: -1 });
  }
   async sumNetAmount(dateRange:{startDate:Date,endDate:Date}):Promise<number>{
     const match:FilterQuery<IPayoutBatch>={};
        if (dateRange) {
          match.createdAt = { $gte: dateRange.startDate, $lte: dateRange.endDate };
        }
      const result=await this.model.aggregate([
        {$match:match},
        {$group:{_id:null,total:{$sum:'$netAmount'}}}
      ]);
      return result[0]?.total ?? 0;
    }
}