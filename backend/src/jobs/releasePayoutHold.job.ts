import { payoutLedgerService } from '@/container';
import cron from 'node-cron';

export function startReleasePayoutHoldsJob() {
  cron.schedule('*/15 * * * *', async () => { // every 15 minutes — doesn't need 5-second granularity like session completion
    try {
      await payoutLedgerService.releaseHoldExpiredPayouts();
    } catch (err) {
      console.error('Error running payout hold-release job:', err);
    }
  });
}