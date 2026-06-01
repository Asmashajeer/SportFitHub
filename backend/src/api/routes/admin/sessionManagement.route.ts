
import { sessionManagementController } from '@/container';
import { Router } from 'express';
const router = Router();

router.get('/getStats', sessionManagementController.getSessionStats);
router.get('/:sessionModel', sessionManagementController.getSessions);
router.get('/:sessionModel/:id', sessionManagementController.getSession);
router.patch('/:sessionModel/:id/approve', sessionManagementController.approveSessions);
router.patch('/:sessionModel/:id/activate', sessionManagementController.activateSessions);
export default router;