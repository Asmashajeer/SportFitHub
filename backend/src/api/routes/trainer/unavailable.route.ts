import { trainerUnavailabilityController } from '@/container';
import { Router } from 'express';
const router = Router();
router.post('/',trainerUnavailabilityController.CancelAvailability);
router.delete("/:date",trainerUnavailabilityController.restoreAvailability);
router.get('/',trainerUnavailabilityController.getUnAvailabileDays);
export default router;