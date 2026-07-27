import { reviewController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import {Router} from 'express'
const router=Router();

router.use(protect);


router.get('/pending',reviewController.getPendingReviews);
router.get('/session/:sessionId',reviewController.getSessionForReview);
router.post('/:sessionModel/:sessionId',reviewController.submitReview)
router.get('/rating/:sessionModel/:sessionId',reviewController.getAvgRatingAndReviewCount)
router.get('/:sessionModel/:sessionId',reviewController.getReviews)
router.get('/topReviews',reviewController.TopReviews);

export default router;