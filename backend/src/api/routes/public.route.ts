import { bookingController, fitnessController, fitnessSessionController, reviewController, sessionController, sportsController, sportsSessionController } from '@/container';
import { Router } from 'express';
const router = Router();



router.get('/sessions/search',sessionController.searchSessions);
//-----------------sports -----------------
router.get('/sportsCategory', sportsController.getAvailableSports);
router.get('/sportsCategory', sportsController.getAvailableSports);
router.get('/sports/sessions', sportsSessionController.getAllSessions);
router.get('/sports/sessions/:id', sportsSessionController.getSportSession);

//----------------------fitness -------------------
router.get('/fitnessCategory', fitnessController.getAvailableFitnessPrograms);
router.get('/fitness/sessions', fitnessSessionController.getAllSessions);
router.get('/fitness/sessions/:id', fitnessSessionController.getFitnessSession);
router.get('/checkSlotAvailability', bookingController.checkAvailability);
router.get('/availability/:sessionId', bookingController.getPublicBookedSlots);


//--------------------- public review--------------
router.get('/batch_rating_review/:sessionModel',reviewController.getBatchRatingAndReviewCount)
router.get('/rating/:sessionModel/:sessionId',reviewController.getAvgRatingAndReviewCount)
router.get('/session_review/:sessionModel/:sessionId',reviewController.getReviews)
export default router;
