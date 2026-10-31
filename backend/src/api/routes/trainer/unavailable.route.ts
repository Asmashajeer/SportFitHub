import { trainerUnavailabilityController } from '@/container';
import { CancelAvailabilitySchema } from '@/dtos/request/trainer/trainer.unavailability.request';
import { validateBody } from '@/middleware/validate.middleware';
import { Router } from 'express';
const router = Router();
router.post('/',validateBody(CancelAvailabilitySchema),trainerUnavailabilityController.CancelAvailability);
router.delete("/:date",trainerUnavailabilityController.restoreAvailability);
router.get('/',trainerUnavailabilityController.getUnAvailabileDays);
export default router;