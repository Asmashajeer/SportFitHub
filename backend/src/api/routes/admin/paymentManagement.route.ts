import { paymentsManagementController } from '@/container';
import { Router } from 'express';
const router = Router();

router.get('/stats', paymentsManagementController.getpaymentsStats);
router.get('/', paymentsManagementController.getAllPayments);

export default router;