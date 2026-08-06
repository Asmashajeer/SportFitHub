import { paymentsManagementController } from '@/container';
import { Router } from 'express';
const router = Router();

// router.get('/stats', paymentsManagementController.getpaymentsStats);
router.get('/', paymentsManagementController.getAllPayments);
// router.get('/:id', paymentsManagementController.getBookingDetails);
export default router;