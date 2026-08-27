import { stripeConnectController, trainerEarningsController } from '@/container';
import { Router } from 'express';
const router = Router();
router.get('/summary', trainerEarningsController.getEarningsSummary);
router.get('/sessions', trainerEarningsController.getSessionEarnings);
router.get('/history', trainerEarningsController.getPayoutHistory);

router.get('/stripe_status',stripeConnectController.status);
router.get('/stripe_connect', stripeConnectController.connect);
router.get('/stripe_refresh-link', stripeConnectController.regenerateLink);
export default router;