import { reviewController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import {Router} from 'express'
const router=Router();

router.use(protect);


router.get('/pending',reviewController.getPendingReviews);
router.get('/session/:sessionId',reviewController.getSessionForReview);
router.post('/:sessionModel/:sessionId',reviewController.submitReview)



router.get('/topReviews',reviewController.TopReviews);
router.get('/allReviews',reviewController.getAllSessionReviewsByTrainer);
export default router;