import { bookingService } from '@/container';
import bookingSessionModel from '@/models/booking.session.model';
import cron from 'node-cron';
export function startAutoCompleteSessionsJob() {
  cron.schedule('*/5 * * * * ', async () => {
    try {
      await bookingService.autoCompleteSessions();
    } catch (err) {
      console.error('Error running auto-complete job:', err);
    }
  });
}
