import { Router } from 'express';

import { protect } from '@/middleware/auth.middleware';
import { timezoneMiddleware } from '@/middleware/timezone.middleware';
import { restrictTo } from '@/middleware/role.middleware';
const router = Router();

import { bookingController, paymentController } from '@/container';
import { UserRole } from '@/constants/enums';

router.use(protect);
router.use(timezoneMiddleware); 
router.use(restrictTo([UserRole.USER]));

router.get('/checkSlotAvailability',bookingController.checkAvailability);
router.post('/check-duplicate-booking',bookingController.checkDuplicateBooking);

router.post('/payment/create-checkout-session',  paymentController.createCheckoutSession);

router.get ('/status/:stripeSessionId',bookingController.getBookingStatus);
router.get('/my-bookings',bookingController.getUserBookings);
router.get('/my-sessions',bookingController.getUserSessions);
router.get('/my-payments',paymentController.getUserPayments);
router.get('/payment/invoice/:invoiceId',paymentController.getInvoice);
router.put('/sessions/:sessionBookingId/reschedule',bookingController.rescheduleBookedSession)
router.patch('/sessions/:sessionBookingId',bookingController.cancelBookedSession)




export default router;