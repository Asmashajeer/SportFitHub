import { PAGINATION_LIMIT } from "@/constants/enums";
import { IPayoutBatchRepository } from "@/interfaces/repositories/IPayoutBatch.repository";
import { IPayoutLedgerRepository } from "@/interfaces/repositories/IPayoutLedger.repository";
import { IPenaltyLedgerRepository } from "@/interfaces/repositories/IPenaltyLedger.repository";
import { ITrainerEarningsService } from "@/interfaces/services/trainer/ITrainer.earnings.service";

export class TrainerEarningsService implements ITrainerEarningsService {
      private _payoutLedgerRepo: IPayoutLedgerRepository;
    private _penaltyLedgerRepo: IPenaltyLedgerRepository;
    private _payoutBatchRepo: IPayoutBatchRepository;
  constructor(payoutLedgerRepo: IPayoutLedgerRepository,penaltyLedgerRepo: IPenaltyLedgerRepository,payoutBatchRepo: IPayoutBatchRepository){
    this._payoutLedgerRepo=payoutLedgerRepo;
    this._penaltyLedgerRepo=penaltyLedgerRepo ;
    this._payoutBatchRepo=payoutBatchRepo ;
  }

  async getEarningsSummary(trainerId: string) {
    const balance = await this._payoutLedgerRepo.getBalanceSummary(trainerId);
    const pendingPenalties = await this._penaltyLedgerRepo.findPendingByTrainer(trainerId);
    const penaltyTotal = pendingPenalties.reduce((s, p) => s + p.amount, 0);

    return {
      ...balance,
      pendingPenalties: penaltyTotal,
      estimatedNextPayout: Math.max(balance.payable - penaltyTotal, 0),
    };
  }

 

  async getSessionEarnings(trainerId: string, page: number) {
    const [total,sessions]=await Promise.all([
      this._payoutLedgerRepo.findByTrainerPaginated(trainerId, page),
      this._payoutLedgerRepo.count({trainerId})
    ]);
    return{   
      sessions,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / PAGINATION_LIMIT),
      },
    };
    // return this._payoutLedgerRepo.findByTrainerPaginated(trainerId, page);
  }
   async getPayoutHistory(trainerId: string) {
    return this._payoutBatchRepo.findByTrainer(trainerId);
  }
}