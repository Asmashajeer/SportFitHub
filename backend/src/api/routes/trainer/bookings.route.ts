import { bookingController } from '@/container';
import { Router } from 'express';
const router = Router();
router.get('/:trainerId', bookingController.getBookedSessionsByTrainer);
router.get('/booked-sessions/:sessionId', bookingController.getBookedSessionsBySessionId);

export default router;
