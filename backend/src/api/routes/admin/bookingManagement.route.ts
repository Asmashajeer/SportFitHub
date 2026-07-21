import { bookingsManagementController } from '@/container';
import { Router } from 'express';
const router = Router();

router.get('/stats', bookingsManagementController.getBookingsStats);
router.get('/', bookingsManagementController.getBookings);
router.get('/:id', bookingsManagementController.getBookingDetails);
export default router;
