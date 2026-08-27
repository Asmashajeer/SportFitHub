import { IPayoutLedgerRepository } from '@/interfaces/repositories/IPayoutLedger.repository';
import { IPenaltyLedgerRepository } from '@/interfaces/repositories/IPenaltyLedger.repository';
import { PAYOUT_BATCH_STATUS } from '@/constants/enums';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { IPayoutService } from '@/interfaces/services/trainer/IPayout.service';
import { IPayoutBatchRepository } from '@/interfaces/repositories/IPayoutBatch.repository';
import { Types } from 'mongoose';
import Stripe from 'stripe';

export class PayoutService implements IPayoutService {
  private _payoutLedgerRepo: IPayoutLedgerRepository;
  private _penaltyLedgerRepo: IPenaltyLedgerRepository;
  private _payoutBatchRepo: IPayoutBatchRepository;
  private _trainerRepo: ITrainerRepository;
  private _stripe: Stripe;
  constructor(payoutLedgerRepo: IPayoutLedgerRepository, penaltyLedgerRepo: IPenaltyLedgerRepository, payoutBatchRepo: IPayoutBatchRepository, trainerRepo: ITrainerRepository, stripe: Stripe) {
    this._payoutLedgerRepo = payoutLedgerRepo;
    this._penaltyLedgerRepo = penaltyLedgerRepo;
    this._payoutBatchRepo = payoutBatchRepo;
    this._trainerRepo = trainerRepo;
    this._stripe = stripe;
  }

  async runWeeklyPayout(): Promise<void> {
    const trainerIds = await this._payoutLedgerRepo.getDistinctPayableTrainerIds();

    for (const trainerId of trainerIds) {
      await this._processTrainerPayout(trainerId.toString());
    }
  }

  private async _processTrainerPayout(trainerId: string): Promise<void> {
    const payableRows = await this._payoutLedgerRepo.findPayableByTrainer(trainerId);
    const earningsTotal = payableRows.reduce((sum, r) => sum + r.trainerShare, 0);

    const pendingPenalties = await this._penaltyLedgerRepo.findPendingByTrainer(trainerId);
    const penaltyTotal = pendingPenalties.reduce((sum, p) => sum + p.amount, 0);

    const netAmount = earningsTotal - penaltyTotal;

    if (earningsTotal === 0 && penaltyTotal === 0) return;

    const baseBatchData = {
      trainerId: new Types.ObjectId(trainerId),
      earningsTotal,
      penaltyTotal,
      netAmount,
      sessionCount: payableRows.length,
      penaltyCount: pendingPenalties.length,
      runAt: new Date(),
    };

    if (netAmount <= 0) {
      await this._payoutBatchRepo.create({ ...baseBatchData, status: PAYOUT_BATCH_STATUS.SKIPPED });

      return; // rows stay payable/pending — automatically retried next run
    }

    try {
      const trainer = await this._trainerRepo.findById(trainerId);
      if (!trainer?.stripeAccountId) {
        throw new Error('Trainer has no connected Stripe account');
      }

      const transfer = await this._stripe.transfers.create({
        amount: Math.round(netAmount * 100), // Stripe expects amount in cents/fils
        currency: 'inr',
        destination: trainer.stripeAccountId,
      });

      await this._payoutLedgerRepo.markPaidBulk(payableRows.map((r) => r._id));
      await this._penaltyLedgerRepo.markDeductedBulk(pendingPenalties.map((p) => p._id));

      await this._payoutBatchRepo.create({
        ...baseBatchData,
        status: PAYOUT_BATCH_STATUS.TRANSFERRED,
        stripeTransferId: transfer.id,
      });
    } catch (err) {
      await this._payoutBatchRepo.create({
        ...baseBatchData,
        status: PAYOUT_BATCH_STATUS.FAILED,
        failureReason: err.message,
      });
    }
  }
}
