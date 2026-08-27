import { IPayoutLedgerRepository } from "@/interfaces/repositories/IPayoutLedger.repository";
import { IPayoutLedgerService } from "@/interfaces/services/trainer/IPayout.Ledger.service";

export class PayoutLedgerService implements IPayoutLedgerService {

  private _payoutLedgerRepo: IPayoutLedgerRepository;

  constructor(payoutLedgerRepo: IPayoutLedgerRepository){
    this._payoutLedgerRepo = payoutLedgerRepo; 
   
  }


//---------release payout-hold----cron job--------
async releaseHoldExpiredPayouts(): Promise<{ modifiedCount: number }> {
  const{ modifiedCount} = await this._payoutLedgerRepo.releaseExpiredHolds();
  if (modifiedCount > 0) {
    console.log(`Released ${modifiedCount} payout ledger entries from hold to payable`);
  }
  return { modifiedCount };
}
}