export function startWeeklyPayoutJob() {
  cron.schedule('0 9 * * 1', async () => { // every Monday, 9 AM
    try {
      await payoutService.runWeeklyPayout();
      console.log('Weekly payout run completed');
    } catch (err) {
      console.error('Error running weekly payout job:', err);
    }
  });
}